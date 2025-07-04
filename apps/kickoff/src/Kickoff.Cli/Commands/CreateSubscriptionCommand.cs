using System.CommandLine;
using System.CommandLine.Invocation;
using Kickoff.Cli.Exceptions;
using Kickoff.Cli.Helpers;
using Kickoff.Cli.Models;
using Kickoff.Cli.Services;
using Microsoft.Extensions.Logging;

namespace Kickoff.Cli.Commands;

public class CreateSubscriptionCommand : Command
{
    public CreateSubscriptionCommand()
     : base("subscription", "Configure a new subscription")
    {
        var projectOpt = new Option<string>(
            aliases: ["--project-name", "-n"],
            description: "The project short name (maximum 2 letters)")
        {
            IsRequired = true,
        };

        projectOpt.AddValidator(result =>
        {
            var value = result.GetValueOrDefault<string>();
            if (value?.Length != 2)
                result.ErrorMessage = "Value must be 2 letters";
        });

        var envOpt = new Option<string>(
            aliases: ["--environment", "-e"],
            description: "The environment short value: 'd' (dev), 'u' (uat) or 'p' (prod)")
        {
            IsRequired = true
        };

        envOpt.AddValidator(result =>
        {
            var value = result.GetValueOrDefault<string>();
            if (value?.Length != 1)
                result.ErrorMessage = "Value must be 1 letter";
        });

        AddOption(projectOpt);
        AddOption(envOpt);
    }
}

internal class CreateSubscriptionCommandHandler(
    IAzureService azureService,
    IGitHubService githubService,
    ILogger<CreateSubscriptionCommand> logger) : ICommandHandler
{
    private readonly IAzureService _azureService = azureService;
    private readonly IGitHubService _githubService = githubService;
    private readonly ILogger<CreateSubscriptionCommand> _logger = logger;

    public required string ProjectName { get; set; }
    public required string Environment { get; set; }

    public int Invoke(InvocationContext context)
    {
        throw new NotImplementedException("Use async version");
    }

    public async Task<int> InvokeAsync(InvocationContext context)
    {
        const string APP_NAME = "bootstrapper";
        const string OWNER = "pagopa";
        const string REPO = "eng-azure-authorization";
        const string FILE_PATH = "src/azure-subscriptions/subscriptions/{0}/terraform.tfvars";
        const string PR_TITLE = "Update IO Authorization Config";
        const string PR_BODY = "This PR updates the authorization configuration with new settings.";

        var cancellationToken = context.GetCancellationToken();

        var user = await _azureService.GetUserDisplayNameAsync(cancellationToken);
        if (user is null)
            throw new AzureUserNotFoundException();

        string subscriptionId = await _azureService.GetSubscriptionIdAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(subscriptionId))
            throw new SubscriptionNotAvailableException();

        bool isGitHubAvailable = await _githubService.IsAuthenticatedAsync(cancellationToken);
        if (!isGitHubAvailable)
            throw new GitHubUserNotFoundException();

        _logger.LogInformation("Hello, {fullname}!", user.Name);

        _logger.LogInformation("Creating identity of the subscription...");

        AzureManagedIdentityDetails id = await CreateIdentityAsync(APP_NAME, subscriptionId, cancellationToken);

        _logger.LogInformation("Identity '{idName}' created!", id.Name);

        string rgId = await _azureService.CreateResourceGroupAsync(
            ProjectName,
            Environment,
            "terraform",
            cancellationToken);

        var storageAccount = await _azureService.CreateStorageAccountAsync(
            ProjectName,
            Environment,
            "tf",
            rgId,
            cancellationToken);

        await _azureService.AddRoleAssignment(
            AzureRolesHelper.RoleIds["Storage Blob Data Owner"],
            user.Id,
            storageAccount.Id,
            AzureRoleAssignmentType.User,
            cancellationToken);

        await _azureService.CreateStorageAccountContainerAsync(
            ProjectName,
            Environment,
            "terraform-state",
            storageAccount.Name,
            rgId,
            cancellationToken);

        _logger.LogInformation("Preparing PR...");

        string subscriptionName = await _azureService.GetSubscriptionNameAsync(cancellationToken);

        bool success = await CreatePullRequestAsync(
            OWNER,
            REPO,
            string.Format(FILE_PATH, subscriptionName),
            PR_TITLE,
            PR_BODY,
            cancellationToken);

        return success ? 0 : 1;
    }

    private async Task<AzureManagedIdentityDetails> CreateIdentityAsync(
        string appName,
        string subscriptionId,
        CancellationToken cancellationToken)
    {
        string rgId = await _azureService.CreateResourceGroupAsync(
            ProjectName,
            Environment,
            appName,
            cancellationToken);

        var identity = await _azureService.CreateManagedIdentityAsync(
            ProjectName,
            Environment,
            appName,
            rgId,
            cancellationToken);

        await _azureService.AddRoleAssignment(
            AzureRolesHelper.RoleIds["Contributor"],
            identity.PrincipalId,
            $"/subscriptions/{subscriptionId}",
            AzureRoleAssignmentType.ServicePrincipal,
            cancellationToken);

        await _azureService.AddRoleAssignment(
            AzureRolesHelper.RoleIds["Role Based Access Control Administrator"],
            identity.PrincipalId,
            $"/subscriptions/{subscriptionId}",
            AzureRoleAssignmentType.ServicePrincipal,
            cancellationToken);

        return identity;
    }

    private async Task<bool> CreatePullRequestAsync(
        string owner,
        string repo,
        string filePath,
        string prTitle,
        string prBody,
        CancellationToken cancellationToken)
    {
        if (!await _githubService.IsAuthenticatedAsync(cancellationToken))
        {
            _logger.LogError("GitHub CLI is not authenticated. Please run 'gh auth login'");
            throw new GitHubUserNotFoundException();
        }

        var defaultBranch = await _githubService.GetDefaultBranchAsync(owner, repo, cancellationToken);
        if (string.IsNullOrEmpty(defaultBranch))
        {
            _logger.LogError("Failed to get default branch for {Owner}/{Repo}", owner, repo);
            return false;
        }

        var latestCommitSha = await _githubService.GetLatestCommitShaAsync(owner, repo, defaultBranch, cancellationToken);
        if (string.IsNullOrEmpty(latestCommitSha))
        {
            _logger.LogError("Failed to get latest commit SHA for {Owner}/{Repo}:{Branch}", owner, repo, defaultBranch);
            return false;
        }

        var branchName = $"feature/update-config-{DateTime.Now:yyyyMMdd-HHmmss}";
        if (!await _githubService.CreateBranchAsync(owner, repo, branchName, latestCommitSha, cancellationToken))
        {
            _logger.LogError("Failed to create branch {BranchName}", branchName);
            return false;
        }

        var currentFile = await _githubService.GetFileContentAsync(owner, repo, filePath, defaultBranch, cancellationToken);
        if (currentFile is null)
        {
            _logger.LogError("Failed to get current file content for {FilePath}", filePath);
            return false;
        }

        var modifiedContent = AddItemToServicePrincipalsName(currentFile.Content, "dx-d-itn-bootstrapper-id-01");

        var result = await _githubService.UpdateFileAsync(
            owner,
            repo,
            filePath,
            modifiedContent,
            currentFile.Sha,
            branchName,
            "Update permissions",
            cancellationToken);

        if (!result)
        {
            _logger.LogError("Failed to update file {FilePath}", filePath);
            return false;
        }

        return await _githubService.CreatePullRequestAsync(
            owner,
            repo,
            prTitle,
            prBody,
            branchName,
            defaultBranch,
            cancellationToken);
    }

    private static string AddItemToServicePrincipalsName(string tfvarsContent, string newItem)
    {
        var pattern = @"service_principals_name\s*=\s*\[(.*?)\]";
        var regex = new System.Text.RegularExpressions.Regex(pattern, System.Text.RegularExpressions.RegexOptions.Singleline);
        var match = regex.Match(tfvarsContent);
        if (!match.Success)
            return tfvarsContent;

        var listContent = match.Groups[1].Value;
        if (listContent.Contains($"\"{newItem}\""))
            return tfvarsContent;

        newItem = $"\"{newItem}\",".PadLeft(newItem.Length + 7, ' ');

        var newListContent = $"{listContent.TrimEnd()}\n{newItem}";
        return regex.Replace(tfvarsContent, $"service_principals_name = [{newListContent}\n  ]");
    }
}

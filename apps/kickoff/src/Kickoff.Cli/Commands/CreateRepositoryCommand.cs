using System.CommandLine;
using System.CommandLine.Invocation;
using Kickoff.Cli.Exceptions;
using Kickoff.Cli.Services;
using Microsoft.Extensions.Logging;

namespace Kickoff.Cli.Commands;

public class CreateRepositoryCommand : Command
{
    public CreateRepositoryCommand()
     : base("repository", "Configure a new monorepository")
    { }
}

internal class CreateRepositoryCommandHandler(
    IGitHubService githubService,
    ILogger<CreateRepositoryCommandHandler> logger) : ICommandHandler
{
    private readonly IGitHubService _githubService = githubService;
    private readonly ILogger<CreateRepositoryCommandHandler> _logger = logger;

    public int Invoke(InvocationContext context)
    {
        throw new NotImplementedException("Use async version");
    }

    public async Task<int> InvokeAsync(InvocationContext context)
    {
        CancellationToken cancellationToken = context.GetCancellationToken();

        const string OWNER = "pagopa";
        const string REPO = "eng-azure-authorization";
        const string FILE_PATH = "src/azure-subscriptions/subscriptions/PROD-IO/terraform.tfvars";
        const string PR_TITLE = "Update IO Authorization Config";
        const string PR_BODY = "This PR updates the authorization configuration with new settings.";

        try
        {
            bool success = await CreateJsonUpdatePullRequestAsync(
                OWNER,
                REPO,
                FILE_PATH,
                PR_TITLE,
                PR_BODY,
                cancellationToken);

            if (success)
            {
                _logger.LogInformation("Successfully created pull request");
                return 0;
            }

            _logger.LogError("Failed to create pull request");
            return 1;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating repository");
            return 1;
        }
    }

    private async Task<bool> CreateJsonUpdatePullRequestAsync(
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

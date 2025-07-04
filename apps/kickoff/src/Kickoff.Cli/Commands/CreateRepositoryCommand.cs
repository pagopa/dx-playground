using System.CommandLine;
using System.CommandLine.Invocation;
using Kickoff.Cli.Exceptions;
using Kickoff.Cli.Models;
using Kickoff.Cli.Services;
using Microsoft.Extensions.Logging;

namespace Kickoff.Cli.Commands;

public class CreateRepositoryCommand : Command
{
    public CreateRepositoryCommand()
     : base("repository", "Configure a new monorepository")
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

        var cspOpt = new Option<string>(
            aliases: ["--csp", "-c"],
            description: "Name of the Cloud Service Provider")
        {
            IsRequired = true,
        };

        cspOpt.AddValidator(result =>
        {
            var value = result.GetValueOrDefault<string>();
            if (!string.Equals(value, "azure", StringComparison.InvariantCultureIgnoreCase))
                result.ErrorMessage = "The only value supported is 'azure'";
        });

        var nameOpt = new Option<string>(
            aliases: ["--repo-name", "-r"],
            description: "Repository name")
        {
            IsRequired = true,
        };

        var orgOpt = new Option<string>(
            aliases: ["--organization", "-o"],
            description: "GitHub organization name",
            getDefaultValue: () => "pagopa")
        {
            IsRequired = false,
        };

        var descOpt = new Option<string>(
            aliases: ["--description", "-d"],
            description: "Repository description")
        {
            IsRequired = true,
        };

        AddOption(projectOpt);
        AddOption(envOpt);
        AddOption(cspOpt);
        AddOption(nameOpt);
        AddOption(orgOpt);
        AddOption(descOpt);
    }
}

internal class CreateRepositoryCommandHandler(
    IAzureService azureService,
    IGitHubService githubService,
    ILogger<CreateRepositoryCommandHandler> logger) : ICommandHandler
{
    private readonly IAzureService _azureService = azureService;
    private readonly IGitHubService _githubService = githubService;
    private readonly ILogger<CreateRepositoryCommandHandler> _logger = logger;

    public required string Csp { get; set; }
    public required string RepoName { get; set; }
    public required string Description { get; set; }
    public required string Organization { get; set; }
    public required string ProjectName { get; set; }
    public required string Environment { get; set; }

    public int Invoke(InvocationContext context)
    {
        throw new NotImplementedException("Use async version");
    }

    public async Task<int> InvokeAsync(InvocationContext context)
    {
        const string GITHUB_ENVIRONMENT = "bootstrapper";

        CancellationToken cancellationToken = context.GetCancellationToken();

        AzureAccount? user = await _azureService.GetUserDisplayNameAsync(cancellationToken) ?? throw new AzureUserNotFoundException();

        string subscriptinId = await _azureService.GetSubscriptionIdAsync(cancellationToken);
        Guid tenantId = await _azureService.GetTenantIdAsync(cancellationToken);

        bool isGitHubAvailable = await _githubService.IsAuthenticatedAsync(cancellationToken);
        if (!isGitHubAvailable)
            throw new GitHubUserNotFoundException();

        _logger.LogInformation("Hello, {fullname}!", user.Name);

        _logger.LogInformation("Creating a new repository...");

        await _githubService.CreatePublicRepositoryAsync(
            Organization,
            RepoName,
            Description,
            cancellationToken);

        await _githubService.CreateGitHubEnvironmentAsync(
            Organization,
            RepoName,
            GITHUB_ENVIRONMENT,
            cancellationToken);

        _logger.LogInformation("Federating subscription identity with new repository...");

        var id = await _azureService.FederateIdWithGitHubAsync(
            ProjectName,
            Environment,
            "bootstrapper",
            "bootstrapper",
            "krusty93",
            RepoName,
            GITHUB_ENVIRONMENT,
            cancellationToken);

        _logger.LogInformation("Configuring the repository...");

        await _githubService.CreateGitHubVariableAsync(
            Organization,
            RepoName,
            "ARM_CLIENT_ID",
            id.PrincipalId.ToString(),
            environment: GITHUB_ENVIRONMENT,
            isSecret: true,
            cancellationToken: cancellationToken);

        await _githubService.CreateGitHubVariableAsync(
            Organization,
            RepoName,
            "ARM_SUBSCRIPTION_ID",
            subscriptinId,
            isSecret: true,
            cancellationToken: cancellationToken);

        await _githubService.CreateGitHubVariableAsync(
            Organization,
            RepoName,
            "ARM_TENANT_ID",
            tenantId.ToString(),
            isSecret: true,
            cancellationToken: cancellationToken);

        _logger.LogInformation("Done!");

        return 0;
    }
}

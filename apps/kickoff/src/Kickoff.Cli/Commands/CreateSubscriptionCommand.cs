using System.CommandLine;
using System.CommandLine.Invocation;
using Kickoff.Cli.Exceptions;
using Kickoff.Cli.Helpers;
using Kickoff.Cli.Services;
using Microsoft.Extensions.Logging;
using Spectre.Console;

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
    ILogger<CreateSubscriptionCommand> logger) : ICommandHandler
{
    private readonly IAzureService _azureService = azureService;
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

        var cancellationToken = context.GetCancellationToken();

        var fullname = await _azureService.GetUserDisplayNameAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(fullname))
            throw new AzureUserNotFoundException();

        AnsiConsole.MarkupLine($"[green]Hello, [bold]{fullname}[/][/]");

        await _azureService.CreateServicePrincipalAsync(
            ProjectName,
            Environment,
            APP_NAME,
            cancellationToken);

        string rgId = await _azureService.CreateResourceGroupAsync(
            ProjectName,
            Environment,
            APP_NAME,
            cancellationToken);

        Guid idPrincipalId = await _azureService.CreateManagedIdentityAsync(
            ProjectName,
            Environment,
            APP_NAME,
            rgId,
            cancellationToken);

        var subscriptionId = await _azureService.GetSubscriptionIdAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(subscriptionId))
            throw new SubscriptionNotAvailableException();

        await _azureService.AddRoleAssignment(
            AzureRolesHelper.RoleIds["Contributor"],
            idPrincipalId,
            subscriptionId,
            cancellationToken);

        await _azureService.AddRoleAssignment(
            AzureRolesHelper.RoleIds["Role Based Access Control Administrator"],
            idPrincipalId,
            subscriptionId,
            cancellationToken);

        // await _azureService.AddEntraIdRoleAsync(
        //     idPrincipalId,
        //     cancellationToken
        // );

        return 0;
    }
}

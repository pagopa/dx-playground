using System.CommandLine;
using System.CommandLine.Invocation;
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
    IAzureService azureService,
    ILogger<CreateRepositoryCommandHandler> logger) : ICommandHandler
{
    private readonly IAzureService _azureService = azureService;
    private readonly ILogger<CreateRepositoryCommandHandler> _logger = logger;

    public int Invoke(InvocationContext context)
    {
        _logger.LogDebug("Running");
        return 0;
    }

    public Task<int> InvokeAsync(InvocationContext context)
    {
        _logger.LogDebug("Running async");
        return Task.FromResult(0);
    }
}

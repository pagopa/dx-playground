using System.CommandLine;
using System.CommandLine.Invocation;
using Microsoft.Extensions.Logging;

namespace Kickoff.Cli.Commands;

public class CreateRepositoryCommand : Command
{
    public CreateRepositoryCommand()
     : base("subscription", "configure a subscription")
    { }
}

internal class CreateRepositoryCommandHandler(ILogger<CreateRepositoryCommandHandler> logger) : ICommandHandler
{
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

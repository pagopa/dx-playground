using System.CommandLine;
using System.CommandLine.Invocation;
using Microsoft.Extensions.Logging;

namespace Kickoff.Cli.Commands;

public class CreateRepositoryCommand : Command
{
    public CreateRepositoryCommand()
     : base("repository", "Configure a new monorepository")
    { }
}

internal class CreateRepositoryCommandHandler(
    ILogger<CreateRepositoryCommandHandler> logger) : ICommandHandler
{
    private readonly ILogger<CreateRepositoryCommandHandler> _logger = logger;

    public int Invoke(InvocationContext context)
    {
        throw new NotImplementedException("Use async version");
    }

    public Task<int> InvokeAsync(InvocationContext context)
    {
        throw new NotImplementedException();
    }
}

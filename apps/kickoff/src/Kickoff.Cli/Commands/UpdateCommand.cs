using System.CommandLine;
using System.CommandLine.Invocation;

namespace Kickoff.Cli.Commands;

public class UpdateCommand : Command
{
    public UpdateCommand()
        : base("update", "Update a resource.")
    { }
}

internal class UpdateCommandHandler() : ICommandHandler
{
    public int Invoke(InvocationContext context)
    {
        throw new NotImplementedException();
    }

    public Task<int> InvokeAsync(InvocationContext context)
    {
        throw new NotImplementedException();
    }
}

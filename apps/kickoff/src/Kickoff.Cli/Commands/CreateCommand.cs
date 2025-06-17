using System.CommandLine;

namespace Kickoff.Cli.Commands;

public class CreateCommand : Command
{
    public CreateCommand()
        : base("create", "Create a new resource.")
    {
        AddCommands(this);
    }

    public static void AddCommands(Command command)
    {
        var subCmd = new CreateSubscriptionCommand();
        command.AddCommand(subCmd);

        var repoCmd = new CreateRepositoryCommand();
        command.AddCommand(repoCmd);
    }
}

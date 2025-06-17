using Spectre.Console;

namespace Kickoff.Cli;

public class Wizard
{
    private static string s_mode;

    public static async Task RunInteractiveWizardAsync()
    {
        AnsiConsole.Write(
        new FigletText("DX Project Kickoff PoC")
            .Color(Color.Blue));

        s_mode = AnsiConsole.Prompt(
            new SelectionPrompt<string>()
                .Title("What do you want to kickoff?")
                .MoreChoicesText("[grey](Move up and down to select the desired option)[/]")
                .AddChoices(
                [
                    "Subscription",
                    "Monorepository",
                ])
        );

        switch (s_mode)
        {
            case "Subscription":
                
                break;
            default:
                throw new NotImplementedException($"Option \"{s_mode}\" not implemented yet");
        }
    }
}

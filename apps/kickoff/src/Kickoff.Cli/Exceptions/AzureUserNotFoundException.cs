namespace Kickoff.Cli.Exceptions;

public class AzureUserNotFoundException : Exception
{
    public AzureUserNotFoundException()
        : base("No Azure account found. Run 'az login'")
    { }
}

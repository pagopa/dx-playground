namespace Kickoff.Cli.Exceptions;

public class AzureUserNotFoundException : Exception
{
    public AzureUserNotFoundException()
        : base("No Azure account found. Run 'az login'")
    { }
}

public class SubscriptionNotAvailableException : Exception
{
    public SubscriptionNotAvailableException()
        : base("No subscription found")
    { }
}

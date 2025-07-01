namespace Kickoff.Cli.Exceptions;

public class GitHubUserNotFoundException : Exception
{
    public GitHubUserNotFoundException()
        : base("No GitHub account found. Run 'gh auth login'")
    { }
}

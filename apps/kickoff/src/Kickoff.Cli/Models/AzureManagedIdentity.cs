
namespace Kickoff.Cli.Models;

public class AzureManagedIdentity(string id, string name)
{
    public string Id { get; } = id;

    public string Name { get; } = name;
}

public class AzureManagedIdentityDetails(
    string id,
    string name,
    Guid principalId) : AzureManagedIdentity(id, name)
{
    public Guid PrincipalId { get; } = principalId;
}

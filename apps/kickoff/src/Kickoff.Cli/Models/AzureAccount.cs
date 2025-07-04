
namespace Kickoff.Cli.Models;

public class AzureAccount(
    string id,
    string name)
{
    public Guid Id { get; } = Guid.Parse(id);
    public string Name { get; } = name;
}

public enum AzureRoleAssignmentType
{
    User,
    ServicePrincipal,
}

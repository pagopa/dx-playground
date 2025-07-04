
namespace Kickoff.Cli.Models;

public class AzureStorageAccount(
    string id,
    string name)
{
    public string Id { get; } = id;
    public string Name { get; } = name;
}

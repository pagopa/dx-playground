
namespace Kickoff.Cli.Helpers;

public static class AzureRolesHelper
{
    public static IDictionary<string, string> RoleIds => new Dictionary<string, string>
    {
        { "Contributor", "b24988ac-6180-42a0-ab88-20f7382dd24c" },
        { "Role Based Access Control Administrator", "f58310d9-a9f6-439a-9e8d-f62e7b41a168" },
        { "Storage Blob Data Owner", "b7e6dc6d-f1e8-4753-8033-0f276bb0955b"}
    };
}

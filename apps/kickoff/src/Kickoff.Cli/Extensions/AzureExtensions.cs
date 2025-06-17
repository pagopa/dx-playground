using Azure.ResourceManager.Models;

namespace Kickoff.Cli.Extensions;

public static class AzureExtensions
{
    /// <summary>
    /// Add tags to Azure resource
    /// </summary>
    /// <param name="azureResource">The resource model definition for an Azure Resource Manager</param>
    /// <param name="project">Project name</param>
    /// <param name="environment">Environment name</param>
    public static void AddDXTags(
        this TrackedResourceData azureResource,
        string project,
        string environment)
    {
        ArgumentNullException.ThrowIfNull(azureResource);

        azureResource.Tags.Add("CostCenter", "TS000 - Tecnologia e Servizi");
        azureResource.Tags.Add("CreatedBy", "ARM");
        azureResource.Tags.Add("Environment", environment == "d" ? "Dev" : environment == "u" ? "Uat" : "Prod");
        azureResource.Tags.Add("BusinessUnit", project == "io" ? "App IO" : "DevEx");
        azureResource.Tags.Add("ManagementTeam", project == "io" ? "IO Platform" : "Developer Experience");
    }
}

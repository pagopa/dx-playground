using Azure.ResourceManager.Models;
using Azure.ResourceManager.Storage;
using Azure.ResourceManager.Storage.Models;

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

        AddDXTags(azureResource.Tags, project, environment);
    }

    /// <summary>
    /// Add tags to Azure Storage Account
    /// </summary>
    /// <param name="storageAccountContent">The resource model definition for an Azure Storage Account</param>
    /// <param name="project">Project name</param>
    /// <param name="environment">Environment name</param>
    public static void AddDXTags(
        this StorageAccountCreateOrUpdateContent storageAccountContent,
        string project,
        string environment)
    {
        ArgumentNullException.ThrowIfNull(storageAccountContent);

        AddDXTags(storageAccountContent.Tags, project, environment);
    }

    /// <summary>
    /// Add tags to Azure Storage Account container
    /// </summary>
    /// <param name="container">The resource model definition for an Azure Storage Account container</param>
    /// <param name="project">Project name</param>
    /// <param name="environment">Environment name</param>
    public static void AddDXTags(
        this BlobContainerData container,
        string project,
        string environment)
    {
        ArgumentNullException.ThrowIfNull(container);

        AddDXTags(container.Metadata, project, environment);
    }

    private static void AddDXTags(IDictionary<string, string> tags, string project, string environment)
    {
        tags.Add("CostCenter", "TS000 - Tecnologia e Servizi");
        tags.Add("CreatedBy", "ARM");
        tags.Add("Environment", environment == "d" ? "Dev" : environment == "u" ? "Uat" : "Prod");
        tags.Add("BusinessUnit", project == "io" ? "App IO" : "DevEx");
        tags.Add("ManagementTeam", project == "io" ? "IO Platform" : "Developer Experience");
    }
}

using Kickoff.Cli.Models;

namespace Kickoff.Cli.Services;

public interface IAzureService
{
    /// <summary>
    /// Get the Id of the default subscription
    /// </summary>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns></returns>
    Task<string> GetSubscriptionIdAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Get the name of the default subscription
    /// </summary>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns></returns>
    Task<string> GetSubscriptionNameAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Get the Id of the subscription's tenant
    /// </summary>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns></returns>
    Task<Guid> GetTenantIdAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Get display name of the current user
    /// </summary>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns>User display name</returns>
    Task<AzureAccount> GetUserDisplayNameAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Create a new Service Principal
    /// </summary>
    /// <param name="project">The project name</param>
    /// <param name="environment">The environment name</param>
    /// <param name="name">Resource group name</param>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns></returns>
    Task CreateServicePrincipalAsync(
        string project,
        string environment,
        string name,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Create a resource group
    /// </summary>
    /// <param name="project">The project name</param>
    /// <param name="environment">The environment name</param>
    /// <param name="name">Resource group name</param>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns></returns>
    Task<string> CreateResourceGroupAsync(
            string project,
            string environment,
            string name,
            CancellationToken cancellationToken = default);

    /// <summary>
    /// Create a user-assigned managed identity
    /// </summary>
    /// <param name="project">The project name</param>
    /// <param name="environment">The environment name</param>
    /// <param name="name">The Managed identity name</param>
    /// <param name="resourceGroupId">The resource group id where create the managed identity</param>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns></returns>
    Task<AzureManagedIdentityDetails> CreateManagedIdentityAsync(
        string project,
        string environment,
        string name,
        string resourceGroupId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Add a role assignment object
    /// </summary>
    /// <param name="roleId">Role id</param>
    /// <param name="principalId">Principal Id of the resource to assign role</param>
    /// <param name="scope">Scope of the role</param>
    /// <param name="type">Type of the target principal</param>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns></returns>
    Task AddRoleAssignment(
        string roleId,
        Guid principalId,
        string scope,
        AzureRoleAssignmentType type,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Create a Storage Account
    /// </summary>
    /// <param name="project">The project name</param>
    /// <param name="environment">The environment name</param>
    /// <param name="name">The Storage Account name</param>
    /// <param name="resourceGroupId">The resource group id where create the storage account</param>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns></returns>
    Task<AzureStorageAccount> CreateStorageAccountAsync(
        string project,
        string environment,
        string name,
        string resourceGroupId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Create a Container in the target Storage Account
    /// </summary>
    /// <param name="project">The project name</param>
    /// <param name="environment">The environment name</param>
    /// <param name="name">Container name</param>
    /// <param name="storageAccountName">Storage Account name</param>
    /// <param name="resourceGroupId">Id of the Storage Account resource group</param>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns></returns>
    Task CreateStorageAccountContainerAsync(
        string project,
        string environment,
        string name,
        string storageAccountName,
        string resourceGroupId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Federate an Azure Managed Identity with a GitHub repository
    /// </summary>
    /// <param name="project">The project name</param>
    /// <param name="environment">The environment name</param>
    /// <param name="resourceGroupName">Resource group of the managed identity</param>
    /// <param name="managedIdentityName">Name of the managed identity</param>
    /// <param name="organization">GitHub repository organization</param>
    /// <param name="repository">GitHub repository name</param>
    /// <param name="githubEnvironment">GitHub repository environment to federate</param>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns></returns>
    Task<AzureManagedIdentityDetails> FederateIdWithGitHubAsync(
        string project,
        string environment,
        string resourceGroupName,
        string managedIdentityName,
        string organization,
        string repository,
        string githubEnvironment,
        CancellationToken cancellationToken = default);
}

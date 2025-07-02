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
    Task<SubscriptionManagedIdentity> CreateManagedIdentityAsync(
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
    Task<StorageAccount> CreateStorageAccountAsync(
        string project,
        string environment,
        string name,
        string resourceGroupId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Create a Storage Account container
    /// </summary>
    /// <param name="project">The project name</param>
    /// <param name="environment">The environment name</param>
    /// <param name="name">The Storage Account container name</param>
    /// <param name="storageAccountName">The Storage Account name</param>
    /// <param name="resourceGroupId">The resource group id of the storage account</param>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns></returns>
    Task CreateStorageAccountContainerAsync(
            string project,
            string environment,
            string name,
            string storageAccountName,
            string resourceGroupId,
            CancellationToken cancellationToken = default);
}

public class SubscriptionManagedIdentity(
    string id,
    string name,
    Guid principalId)
{
    public string Id { get; } = id;
    public string Name { get; } = name;
    public Guid PrincipalId { get; } = principalId;
}

public class StorageAccount(
    string id,
    string name)
{
    public string Id { get; } = id;
    public string Name { get; } = name;
}

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

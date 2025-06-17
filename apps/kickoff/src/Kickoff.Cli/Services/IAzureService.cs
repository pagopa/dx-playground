namespace Kickoff.Cli.Services;

public interface IAzureService
{
    /// <summary>
    /// Get display name of the current user
    /// </summary>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns>User display name</returns>
    Task<string> GetUserDisplayNameAsync(CancellationToken cancellationToken = default);

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
    Task<string> CreateManagedIdentityAsync(
        string project,
        string environment,
        string name,
        string resourceGroupId,
        CancellationToken cancellationToken = default);
}

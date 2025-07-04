using Azure;
using Azure.Core;
using Azure.ResourceManager;
using Azure.ResourceManager.Authorization;
using Azure.ResourceManager.Authorization.Models;
using Azure.ResourceManager.ManagedServiceIdentities;
using Azure.ResourceManager.Resources;
using Azure.ResourceManager.Storage;
using Azure.ResourceManager.Storage.Models;
using Kickoff.Cli.Constants;
using Kickoff.Cli.Extensions;
using Kickoff.Cli.Helpers;
using Kickoff.Cli.Models;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Microsoft.Graph.Models;

namespace Kickoff.Cli.Services;

public class AzureService(
    IAzureClientFactory<GraphServiceClient> factory,
    ArmClient armClient,
    ILogger<AzureService> logger)
    : IAzureService
{
    private readonly GraphServiceClient _graphClient = factory.CreateClient(FactoryConstants.PagoPAGraphClient);
    private readonly ArmClient _armClient = armClient;
    private readonly ILogger<AzureService> _logger = logger;

    private readonly AzureLocation _defaultLocation = AzureLocation.ItalyNorth;

    private SubscriptionResource? _subscriptionId;

    public async Task<string> GetSubscriptionIdAsync(CancellationToken cancellationToken = default) =>
        (await GetSubscriptionAsync(cancellationToken))!.Data.SubscriptionId!;

    public async Task<string> GetSubscriptionNameAsync(CancellationToken cancellationToken = default) =>
        (await GetSubscriptionAsync(cancellationToken))!.Data.DisplayName!;

    public async Task<Guid> GetTenantIdAsync(CancellationToken cancellationToken = default) =>
        (await GetSubscriptionAsync(cancellationToken))!.Data.TenantId!.Value;

    public async Task<AzureAccount> GetUserDisplayNameAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogDebug("Logging into Azure");

            var currentUser = await _graphClient.Me.GetAsync(cancellationToken: cancellationToken);

            _logger.LogDebug("Current User: {userId}", currentUser!.Id);

            return new AzureAccount(
                currentUser.Id!,
                currentUser.DisplayName!);
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex, "No Azure user found");
            throw;
        }
    }

    public async Task CreateServicePrincipalAsync(
        string project,
        string environment,
        string name,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogDebug("Creating a new service principal");

            var spName = new AzureNamingFactory("service_principal")
                .AddProject(project)
                .AddEnvironment(environment)
                .AddName(name)
                .Build();

            var requestBody = new Application
            {
                DisplayName = spName,
            };

            var result = await _graphClient.Applications.PostAsync(requestBody, cancellationToken: cancellationToken);

            _logger.LogInformation("Service principal {id} created", result!.AppId);
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex, "Cannot create the service principal");
            throw;
        }
    }

    public async Task<string> CreateResourceGroupAsync(
        string project,
        string environment,
        string name,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var rgName = new AzureNamingFactory("resource_group")
                .AddProject(project)
                .AddEnvironment(environment)
                .AddRegion()
                .AddName(name)
                .Build();

            SubscriptionResource subscription = await GetSubscriptionAsync(cancellationToken);
            ResourceGroupCollection resourceGroups = subscription.GetResourceGroups();

            var rg = new ResourceGroupData(_defaultLocation);
            rg.AddDXTags(project, environment);

            ArmOperation<ResourceGroupResource> operation = await resourceGroups.CreateOrUpdateAsync(
                WaitUntil.Completed,
                rgName,
                rg,
                cancellationToken);

            return operation.Value.Data.Id!;
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex, "Cannot create the resource group");
            throw;
        }
    }

    public async Task<AzureManagedIdentityDetails> CreateManagedIdentityAsync(
        string project,
        string environment,
        string name,
        string resourceGroupId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            string identityName = new AzureNamingFactory("managed_identity")
                .AddProject(project)
                .AddEnvironment(environment)
                .AddRegion()
                .AddName(name)
                .Build();

            var resourceGroup = _armClient.GetResourceGroupResource(new ResourceIdentifier(resourceGroupId));
            var identityCollection = resourceGroup!.GetUserAssignedIdentities();

            var identityData = new UserAssignedIdentityData(_defaultLocation);
            identityData.AddDXTags(project, environment);

            var operation = await identityCollection.CreateOrUpdateAsync(
                WaitUntil.Completed,
                identityName,
                identityData,
                cancellationToken);

            return new AzureManagedIdentityDetails(
                operation.Value.Data.Id!,
                operation.Value.Data.Name,
                operation.Value.Data.PrincipalId!.Value);
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex, "Cannot create the managed identity");
            throw;
        }
    }

    public async Task<AzureManagedIdentityDetails> FederateIdWithGitHubAsync(
        string project,
        string environment,
        string resourceGroupName,
        string managedIdentityName,
        string organization,
        string repository,
        string githubEnvironment,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var federatedCredentialData = new FederatedIdentityCredentialData
            {
                Issuer = "https://token.actions.githubusercontent.com/",
                Subject = $"repo:{organization}/{repository}:environment:{githubEnvironment}",
                Audiences = { "api://AzureADTokenExchange" }
            };

            var credentialName = $"github-{repository}-{githubEnvironment}".Replace("_", "-").ToLower();

            string identityName = new AzureNamingFactory("managed_identity")
                .AddProject(project)
                .AddEnvironment(environment)
                .AddRegion()
                .AddName(managedIdentityName)
                .Build();

            string resourceGroupFullName = new AzureNamingFactory("resource_group")
                .AddProject(project)
                .AddEnvironment(environment)
                .AddRegion()
                .AddName(resourceGroupName)
                .Build();

            var subscription = await GetSubscriptionAsync(cancellationToken);
            var resourceGroup = await subscription.GetResourceGroupAsync(resourceGroupFullName, cancellationToken);
            var managedIdentity = await resourceGroup.Value.GetUserAssignedIdentityAsync(identityName, cancellationToken);

            UserAssignedIdentityResource id = managedIdentity.Value!;

            var credentials = id.GetFederatedIdentityCredentials();

            await credentials.CreateOrUpdateAsync(
                WaitUntil.Completed,
                credentialName,
                federatedCredentialData,
                cancellationToken);

            return new AzureManagedIdentityDetails(id.Id!, id.Data.Name, id.Data.ClientId!.Value);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failure while federating the managed identity '{id}'", managedIdentityName);
            throw;
        }
    }

    public async Task AddRoleAssignment(
        string roleId,
        Guid principalId,
        string scope,
        AzureRoleAssignmentType type,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var scopeIdentifier = new ResourceIdentifier(scope);
            var roleAssignments = _armClient.GetRoleAssignments(scopeIdentifier);

            await foreach (RoleAssignmentResource assignment in roleAssignments.GetAllAsync(filter: $"principalId eq '{principalId}'", cancellationToken: cancellationToken))
            {
                if (assignment.Data.PrincipalId == principalId &&
                    assignment.Data.RoleDefinitionId.ToString().EndsWith(roleId, StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogDebug("Role assignment already exists for principal {principalId} with role {roleId} on scope {scope}", principalId, roleId, scope);
                    return;
                }
            }

            var sub = await GetSubscriptionAsync(cancellationToken);

            var definition = await sub.GetAuthorizationRoleDefinitionAsync(new(roleId), cancellationToken: cancellationToken);

            var roleAssignmentType = type switch
            {
                AzureRoleAssignmentType.User => RoleManagementPrincipalType.User,
                AzureRoleAssignmentType.ServicePrincipal => RoleManagementPrincipalType.ServicePrincipal,
                _ => throw new NotImplementedException($"Unknown option '{type}'")
            };

            var content = new RoleAssignmentCreateOrUpdateContent(
                definition.Value.Id,
                principalId)
            {
                PrincipalType = roleAssignmentType,
            };

            await roleAssignments.CreateOrUpdateAsync(
                WaitUntil.Completed,
                Guid.NewGuid().ToString(),
                content,
                cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex, "Cannot create the role assignment");
            throw;
        }
    }

    public async Task<AzureStorageAccount> CreateStorageAccountAsync(
        string project,
        string environment,
        string name,
        string resourceGroupId,
        CancellationToken cancellationToken = default)
    {
        string storageAccountName = new AzureNamingFactory("storage_account")
            .AddProject(project)
            .AddEnvironment(environment)
            .AddRegion()
            .AddName(name)
            .Build()
            .Replace("-", string.Empty);

        try
        {

            var resourceGroup = _armClient.GetResourceGroupResource(new ResourceIdentifier(resourceGroupId));
            var storageCollection = resourceGroup!.GetStorageAccounts();

            var storageData = new StorageAccountCreateOrUpdateContent(
                new StorageSku(StorageSkuName.StandardZrs),
                new StorageKind("StorageV2"),
                _defaultLocation)
            {
                AllowBlobPublicAccess = false,
                AllowCrossTenantReplication = false,
                AllowSharedKeyAccess = false,
                AccessTier = StorageAccountAccessTier.Hot,
                EnableHttpsTrafficOnly = true,
                IsDefaultToOAuthAuthentication = false,
                PublicNetworkAccess = StoragePublicNetworkAccess.Enabled,
                MinimumTlsVersion = StorageMinimumTlsVersion.Tls1_2,
                IsLocalUserEnabled = false,
            };

            storageData.AddDXTags(project, environment);

            var operation = await storageCollection.CreateOrUpdateAsync(
                WaitUntil.Completed,
                storageAccountName,
                storageData,
                cancellationToken);

            _logger.LogInformation("Storage Account '{storageAccount}' created", storageAccountName);

            return new AzureStorageAccount(
                operation.Value.Data.Id!,
                operation.Value.Data.Name);
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex, "Cannot create the storage account");
            throw;
        }
    }

    public async Task CreateStorageAccountContainerAsync(
        string project,
        string environment,
        string name,
        string storageAccountName,
        string resourceGroupId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var containerData = new BlobContainerData
            {
                PublicAccess = StoragePublicAccessType.None,
            };

            containerData.AddDXTags(project, environment);

            var resourceGroup = _armClient.GetResourceGroupResource(new ResourceIdentifier(resourceGroupId));
            var storageAccount = await resourceGroup.GetStorageAccountAsync(storageAccountName);
            var blobService = storageAccount.Value.GetBlobService();
            var containers = blobService.GetBlobContainers();

            await containers.CreateOrUpdateAsync(
                WaitUntil.Completed,
                name,
                containerData,
                cancellationToken);

            _logger.LogInformation("Storage Account container '{container}' created", name);
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex, "Cannot create the storage account container");
            throw;
        }
    }

    // public async Task AddEntraIdRoleAsync(
    //     Guid spId,
    //     CancellationToken cancellationToken)
    // {
    //     try
    //     {
    //         string servicePrincipalId = spId.ToString();

    //         ServicePrincipalCollectionResponse graphSp = await _graphClient.ServicePrincipals
    //             .GetAsync(r => r.QueryParameters.Filter = "appId eq '00000003-0000-0000-c000-000000000000'");

    //         string graphSpId = graphSp.Value.First().Id!;

    //         var userReadAllRole = graphSp.Value
    //             .First()
    //             .AppRoles
    //             .First(r => r.Value == "Group.Read.All" && r.AllowedMemberTypes.Contains("Application"));

    //         await _graphClient.ServicePrincipals[servicePrincipalId].AppRoleAssignments
    //             .PostAsync(new AppRoleAssignment
    //             {
    //                 PrincipalId = Guid.Parse(servicePrincipalId),
    //                 ResourceId = Guid.Parse(graphSpId),
    //                 AppRoleId = userReadAllRole.Id
    //             }, cancellationToken: cancellationToken);
    //     }
    //     catch (Exception ex)
    //     {
    //         _logger.LogCritical(ex, "Cannot create the entra id role assignment");
    //         throw;
    //     }
    // }

    private async Task<SubscriptionResource> GetSubscriptionAsync(CancellationToken cancellationToken)
    {
        _subscriptionId ??= await _armClient.GetDefaultSubscriptionAsync(cancellationToken);
        return _subscriptionId;
    }
}

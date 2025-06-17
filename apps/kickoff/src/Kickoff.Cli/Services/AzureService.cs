using Azure;
using Azure.Core;
using Azure.ResourceManager;
using Azure.ResourceManager.Authorization;
using Azure.ResourceManager.Authorization.Models;
using Azure.ResourceManager.ManagedServiceIdentities;
using Azure.ResourceManager.Resources;
using Kickoff.Cli.Constants;
using Kickoff.Cli.Extensions;
using Kickoff.Cli.Helpers;
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

    private SubscriptionResource _subscriptionId;

    public async Task<string?> GetSubscriptionIdAsync(CancellationToken cancellationToken) =>
        (await GetSubscriptionAsync(cancellationToken))?.Id;

    public async Task<string> GetUserDisplayNameAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogDebug("Logging into Azure");

            var currentUser = await _graphClient.Me.GetAsync(cancellationToken: cancellationToken);

            _logger.LogDebug("Current User: {userId}", currentUser.Id);

            return currentUser.DisplayName!;
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex, "No Azure user found");
            return string.Empty;
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

            _logger.LogDebug("Service principal created: {id}", result.AppId);
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

    public async Task<Guid> CreateManagedIdentityAsync(
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
            var identityCollection = resourceGroup.GetUserAssignedIdentities();

            var identityData = new UserAssignedIdentityData(_defaultLocation);
            identityData.AddDXTags(project, environment);

            var operation = await identityCollection.CreateOrUpdateAsync(
                WaitUntil.Completed,
                identityName,
                identityData,
                cancellationToken);

            var principal = operation.Value.Data.PrincipalId!;
            return principal.Value;
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex, "Cannot create the managed identity");
            throw;
        }
    }

    public async Task AddRoleAssignment(
        string roleId,
        Guid principalId,
        string scope,
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

            var content = new RoleAssignmentCreateOrUpdateContent(
                definition.Value.Id,
                principalId)
            {
                PrincipalType = RoleManagementPrincipalType.ServicePrincipal,
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

    private async Task<SubscriptionResource> GetSubscriptionAsync(CancellationToken cancellationToken) =>
        _subscriptionId ?? await _armClient.GetDefaultSubscriptionAsync(cancellationToken);
}

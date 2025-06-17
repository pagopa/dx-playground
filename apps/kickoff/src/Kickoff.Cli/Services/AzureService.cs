using Azure;
using Azure.Core;
using Azure.ResourceManager;
using Azure.ResourceManager.ManagedServiceIdentities;
using Azure.ResourceManager.Models;
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

            SubscriptionResource subscription = await _armClient.GetDefaultSubscriptionAsync(cancellationToken);
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

    public async Task<string> CreateManagedIdentityAsync(
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

            var operation = await identityCollection.CreateOrUpdateAsync(
                WaitUntil.Completed,
                identityName,
                identityData,
                cancellationToken);

            return operation.Value.Data.Id!;
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex, "Cannot create the managed identity");
            throw;
        }
    }
}

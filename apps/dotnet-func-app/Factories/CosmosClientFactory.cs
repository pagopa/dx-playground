using Azure.Identity;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DotNetFuncApp;

public interface ICosmosClientFactory
{
    CosmosClient GetClient();
    Container GetContainer();
}

internal sealed class CosmosClientFactory(IConfiguration configuration, ILogger<CosmosClientFactory> logger) : ICosmosClientFactory, IDisposable
{
    private readonly IConfiguration _configuration = configuration;
    private readonly ILogger<CosmosClientFactory> _logger = logger;
    private CosmosClient? _client;
    private Container? _container;

    private static readonly CosmosClientOptions ClientOptions = new()
    {
        MaxRetryAttemptsOnRateLimitedRequests = 9,
        MaxRetryWaitTimeOnRateLimitedRequests = TimeSpan.FromSeconds(30)
    };

    public CosmosClient GetClient()
    {
        if (_client is not null) return _client;
        var endpoint = _configuration["CosmosAccountEndpoint"] ?? throw new InvalidOperationException("CosmosAccountEndpoint not configured");
        _logger.LogInformation("Creating CosmosClient for {Endpoint}", endpoint);
        var credential = new DefaultAzureCredential();
        _client = new CosmosClient(endpoint, credential, ClientOptions);
        return _client;
    }

    public Container GetContainer()
    {
        if (_container is not null) return _container;
        var client = GetClient();
        _container = client.GetContainer("dx-d-itn-poc-func-cosmos-01", "items");
        return _container;
    }

    public void Dispose()
    {
        _client?.Dispose();
    }
}

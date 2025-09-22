using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Cosmos;
using DotNetFuncApp.Models;

namespace DotNetFuncApp;

public class Functions(ICosmosClientFactory cosmosClientFactory, ILogger<Functions> logger)
{
    private readonly ICosmosClientFactory _cosmosClientFactory = cosmosClientFactory;
    private readonly ILogger<Functions> _logger = logger;

    [Function("Hello")]
    public IActionResult Run(
      [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest _) =>
        new OkObjectResult($"Welcome to Azure Functions: {new Random().Next()}");

    [Function("BulkCreateItems")]
    public async Task<HttpResponseData> BulkCreateItems(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "items/bulk")] HttpRequestData req)
    {
        var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
        if (!int.TryParse(query.Get("number"), out var number) || number <= 0)
        {
            var bad = req.CreateResponse(HttpStatusCode.BadRequest);
            await bad.WriteStringAsync("Query parameter 'number' must be a positive integer");
            return bad;
        }

        var container = _cosmosClientFactory.GetContainer();
        var tasks = new List<Task>();
        for (int i = 0; i < number; i++)
        {
            var guid = Guid.NewGuid().ToString("N");
            var item = new Item(guid, guid, $"this is the item with id {guid}");
            tasks.Add(container.CreateItemAsync(item, new PartitionKey(item.partitionKey)));
        }
        await Task.WhenAll(tasks);

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteStringAsync($"Inserted {number} items");
        return response;
    }

    [Function("CreateItem")]
    public async Task<HttpResponseData> CreateItem(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "items")] HttpRequestData req)
    {
        using var reader = new StreamReader(req.Body);
        var body = await reader.ReadToEndAsync();
        string? id = null;
        if (!string.IsNullOrWhiteSpace(body))
        {
            try
            {
                using var doc = JsonDocument.Parse(body);
                if (doc.RootElement.TryGetProperty("id", out var idProp))
                {
                    id = idProp.GetString();
                }
            }
            catch (JsonException) { /* ignore; fallback below */ }
        }

        id ??= Guid.NewGuid().ToString("N");
        var item = new Item(id, id, $"this is the item {id}");
        var container = _cosmosClientFactory.GetContainer();

        await container.CreateItemAsync(item, new PartitionKey(item.partitionKey));

        var resp = req.CreateResponse(HttpStatusCode.Created);
        await resp.WriteAsJsonAsync(item);
        return resp;
    }
}

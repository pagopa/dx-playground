using DotNetFuncApp;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

var builder = FunctionsApplication.CreateBuilder(args);

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights();

builder.Logging.Services.Configure<LoggerFilterOptions>(options =>
{
    // The Application Insights SDK adds a default logging filter that instructs ILogger to capture only Warning and more severe logs. Application Insights requires an explicit override.
    // Log levels can also be configured using appsettings.json. For more information, see https://learn.microsoft.com/azure/azure-monitor/app/worker-service#ilogger-logs
    LoggerFilterRule defaultRule = options.Rules.FirstOrDefault(rule => rule.ProviderName
        == "Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider");
    if (defaultRule is not null)
    {
        options.Rules.Remove(defaultRule);
    }
});

// builder.ConfigureFunctionsWebApplication();

// builder.ConfigureFunctionsWorkerDefaults();

builder.Services.AddSingleton<ICosmosClientFactory, CosmosClientFactory>();

var host = builder.Build();

await host.RunAsync();

// var host = new HostBuilder()
//     .ConfigureAppConfiguration(c =>
//     {
//         c.AddEnvironmentVariables();
//     })
//     .ConfigureFunctionsWorkerDefaults()
//     .ConfigureServices(services =>
//     {
//         services.AddSingleton<ICosmosClientFactory, CosmosClientFactory>();
//     })
//     .ConfigureLogging(lb =>
//     {
//         lb.AddConsole();
//     })
//     .Build();

// await host.RunAsync();

using Azure.Identity;
using Microsoft.FeatureManagement;

var builder = WebApplication.CreateBuilder(args);

string endpoint = builder.Configuration.GetValue<string>("Endpoints:AppConfiguration")
    ?? throw new InvalidOperationException("The setting `Endpoints:AppConfiguration` was not found.");

builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(endpoint), new DefaultAzureCredential())
        .Select("playground:*", builder.Environment.EnvironmentName)
        .ConfigureRefresh(refreshOptions =>
        {
            refreshOptions.SetRefreshInterval(TimeSpan.FromSeconds(20));
            refreshOptions.Register("playground:Sentinel", refreshAll: true);
        })
        .ConfigureKeyVault(keyVaultOptions =>
        {
            keyVaultOptions.SetCredential(new DefaultAzureCredential());
        })
        .UseFeatureFlags(ffOptions =>
        {
            ffOptions.Select("playground:*", builder.Environment.EnvironmentName);
            ffOptions.SetRefreshInterval(TimeSpan.FromSeconds(15));
        });
});

builder.Services.AddAzureAppConfiguration();
builder.Services.AddFeatureManagement();
builder.Services.AddHealthChecks();

var app = builder.Build();

app.MapGet("setting", (IConfiguration config) =>
{
    var value = config["playground:test"];
    return value ?? string.Empty;
});

app.MapGet("secret", (IConfiguration config) =>
{
    var secret = config["playground:my-api-key"];
    return secret ?? string.Empty;
});

app.MapGet("featureflag", async (IFeatureManager featureManager) =>
{
    bool ff = await featureManager.IsEnabledAsync("filtereddemoff");
    return ff;
});

app.UseAzureAppConfiguration();

app.UseHealthChecks("/healthz");

app.Run();

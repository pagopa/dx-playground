using Azure.Identity;
// using Microsoft.Extensions.Configuration.AzureAppConfiguration;

var builder = WebApplication.CreateBuilder(args);

string endpoint = builder.Configuration.GetValue<string>("Endpoints:AppConfiguration")
    ?? throw new InvalidOperationException("The setting `Endpoints:AppConfiguration` was not found.");

builder.Configuration.AddAzureAppConfiguration(options =>
{
    // var prefix = builder.Environment.IsProduction() ?
    //     string.Empty :
    //     "staging-";

    options.Connect(new Uri(endpoint), new DefaultAzureCredential())
        // .Select("playground:", builder.Environment.EnvironmentName)
        .Select("playground:*", builder.Environment.EnvironmentName)
        // .Select("Playground:*", LabelFilter.Null)
        .ConfigureRefresh(refreshOptions =>
        {
            refreshOptions.SetRefreshInterval(TimeSpan.FromSeconds(20));
            refreshOptions.Register("playground:Sentinel", refreshAll: true);
        })
        .ConfigureKeyVault(keyVaultOptions =>
        {
            keyVaultOptions.SetCredential(new DefaultAzureCredential());
        });
});

builder.Services.AddAzureAppConfiguration();
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

app.UseAzureAppConfiguration();

app.UseHealthChecks("/healthz");

app.Run();

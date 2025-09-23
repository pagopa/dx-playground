using Azure.Identity;

var builder = WebApplication.CreateBuilder(args);

string endpoint = builder.Configuration.GetValue<string>("Endpoints:AppConfiguration")
    ?? throw new InvalidOperationException("The setting `Endpoints:AppConfiguration` was not found.");

builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(endpoint), new DefaultAzureCredential())
        .ConfigureRefresh(refreshOptions =>
        {
            refreshOptions.SetRefreshInterval(TimeSpan.FromMinutes(10));
            refreshOptions.Register("Sentinel", refreshAll: true);
        });
});

builder.Services.AddAzureAppConfiguration();
builder.Services.AddHealthChecks();

var app = builder.Build();

app.MapGet("setting", (IConfiguration config) =>
{
    var value = config["test"];
    return value;
});

app.MapGet("secret", (IConfiguration config) =>
{
    var secret = config["Secret:my-value"];
    return secret;
});

app.UseAzureAppConfiguration();

app.UseHealthChecks("/healthz");

app.Run();

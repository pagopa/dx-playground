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
            refreshOptions.Register("SentinelKey", refreshAll: true);
        });
});

builder.Services.AddAzureAppConfiguration();

var app = builder.Build();

app.MapGet("/", (IConfiguration config) =>
{
    var value = config["test"];
    return value;
});

app.UseAzureAppConfiguration();

app.Run();

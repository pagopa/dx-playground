using System.CommandLine;
using System.CommandLine.Hosting;
using System.CommandLine.Builder;
using System.CommandLine.Parsing;
using Azure.Identity;
using Azure.ResourceManager;
using Kickoff.Cli.Commands;
using Kickoff.Cli.Constants;
using Kickoff.Cli.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Azure;
using Microsoft.Graph;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

Log.Information("Welcome to DX Demo CLI!");

try
{
    var rootCommand = new RootCommand("DX Demo Application")!;

    rootCommand.AddCommand(new CreateCommand());
    rootCommand.AddCommand(new UpdateCommand());

    // rootCommand.SetHandler(() => rootCommand.Invoke("--version"));

    var cmdBuilder = new CommandLineBuilder(rootCommand);

    Parser parser = cmdBuilder
        .UseHost(
            _ => Host.CreateDefaultBuilder(args),
            builder =>
            {
                builder
                    .UseSerilog((hostContext, loggerConfiguration) =>
                    {
                        loggerConfiguration.ReadFrom.Configuration(hostContext.Configuration);
                    })
                    .ConfigureServices((ctx, services) =>
                    {
                        services.AddTransient<IAzureService, AzureService>();
                        services.AddTransient<IGitHubService, GitHubService>();

                        services.AddAzureClients(azureBuilder =>
                        {
                            var credentials = new DefaultAzureCredential(new DefaultAzureCredentialOptions
                            {
                                ExcludeManagedIdentityCredential = true,
                                ExcludeAzureDeveloperCliCredential = true,
                                ExcludeSharedTokenCacheCredential = true,
                                ExcludeVisualStudioCredential = true,
                                ExcludeEnvironmentCredential = true,
                                ExcludeWorkloadIdentityCredential = true,
                                ExcludeAzurePowerShellCredential = true,
                                ExcludeInteractiveBrowserCredential = true,
                            });

                            azureBuilder.UseCredential(credentials);

                            // custom extension for Graph
                            azureBuilder.AddClient<GraphServiceClient, object>((_, credential) =>
                                new GraphServiceClient(
                                    credential,
                                    ["https://graph.microsoft.com/.default"]))
                                .WithName(FactoryConstants.PagoPAGraphClient);

                            azureBuilder.AddClient<ArmClient, ArmClientOptions>((_, credential) =>
                            {
                                var sub = ctx.Configuration["DefaultSubscription"];
                                var client = new ArmClient(credential, sub);
                                return client;
                            });
                        });
                    });

                builder.UseCommandHandler<CreateRepositoryCommand, CreateRepositoryCommandHandler>();
                builder.UseCommandHandler<CreateSubscriptionCommand, CreateSubscriptionCommandHandler>();

                builder.UseCommandHandler<UpdateCommand, UpdateCommandHandler>();
            })
        .UseDefaults()
        .Build();

    return await parser.InvokeAsync(args);
}
catch (Exception ex)
{
    Log.Fatal(ex, "Host terminated unexpectedly");
    return 1;
}
finally
{
    await Log.CloseAndFlushAsync();
}

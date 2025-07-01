using Spectre.Console;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using System.CommandLine;
using System.CommandLine.Hosting;
using System.CommandLine.Builder;
using System.CommandLine.Parsing;
using Kickoff.Cli.Commands;
using Microsoft.Extensions.Azure;
using Microsoft.Graph;
using Azure.Identity;
using Kickoff.Cli.Constants;
using Kickoff.Cli.Services;
using Azure.ResourceManager;

Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

AnsiConsole.Write(
    new FigletText("DX Kickoff PoC")
        .Color(Color.Blue));

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
                    // .UseSerilog((hostContext, loggerConfiguration) =>
                    // {
                    //     loggerConfiguration.ReadFrom.Configuration(hostContext.Configuration);
                    // })
                    .ConfigureServices((ctx, services) =>
                    {
                        services.AddTransient<IAzureService, AzureService>();

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

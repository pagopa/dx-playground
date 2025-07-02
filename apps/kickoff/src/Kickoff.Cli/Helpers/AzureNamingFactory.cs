namespace Kickoff.Cli.Helpers;

public class AzureNamingFactory(string resourceType)
{
    private readonly string _resourceType = resourceType;
    private string? _project;
    private string? _environment;
    private string? _region;
    private string? _name;

    public Dictionary<string, string> ResourceSet { get; } = new()
    {
        { "service_principal", "sp" },
        { "resource_group", "rg" },
        { "managed_identity", "id" },
        { "storage_account", "st" },
    };

    public Dictionary<string, string> RegionSet { get; } = new()
    {
        {
            "italynorth", "itn"
        }
    };

    public AzureNamingFactory AddProject(string project)
    {
        _project = project;
        return this;
    }

    public AzureNamingFactory AddEnvironment(string environment)
    {
        _environment = environment;
        return this;
    }

    public AzureNamingFactory AddRegion(string region = "italynorth")
    {
        _region = region;
        return this;
    }

    public AzureNamingFactory AddName(string name)
    {
        _name = name;
        return this;
    }

    public string Build()
    {
        string toReturn = string.IsNullOrWhiteSpace(_region) ?
            $"{_project}-{_environment}-{_name}-{ResourceSet[_resourceType]}-01" :
            $"{_project}-{_environment}-{RegionSet[_region]}-{_name}-{ResourceSet[_resourceType]}-01";

        _project = null;
        _environment = null;
        _region = null;
        _name = null;

        return toReturn;
    }
}

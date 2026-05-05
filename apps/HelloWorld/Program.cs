var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var sha = Environment.GetEnvironmentVariable("SHA");

app.MapGet("/", () => $"Hello World! SHA: {sha}");

app.Run();

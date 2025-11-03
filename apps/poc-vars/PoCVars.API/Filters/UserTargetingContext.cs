using Microsoft.FeatureManagement.FeatureFilters;

namespace PoCVars.API.Filters;

internal sealed class UserTargetingContext : ITargetingContextAccessor
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserTargetingContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public ValueTask<TargetingContext> GetContextAsync()
    {
        var httpContext = _httpContextAccessor.HttpContext!;

        var targetingContext = new TargetingContext
        {
            UserId = GetUserId(httpContext),
            Groups = GetUserGroups(httpContext),
        };

        return new ValueTask<TargetingContext>(targetingContext);
    }

    private static string GetUserId(HttpContext? httpContext) =>
        httpContext?
            .Request
            .Headers["X-User-Id"]
            .FirstOrDefault()
            ?? string.Empty;

    private static string[] GetUserGroups(HttpContext? httpContext) =>
        httpContext?
            .Request
            .Headers["X-User-Groups"]
            .FirstOrDefault()?
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
        ?? [];
}

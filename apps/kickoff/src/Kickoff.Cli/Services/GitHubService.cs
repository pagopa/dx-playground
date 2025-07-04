using System.Text;
using System.Text.Json;
using Kickoff.Cli.Helpers;
using Microsoft.Extensions.Logging;

namespace Kickoff.Cli.Services;

internal class GitHubService(ILogger<GitHubService> logger) : IGitHubService
{
    private readonly ILogger<GitHubService> _logger = logger;

    public async Task<bool> IsAuthenticatedAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await ProcessHelper.RunGitHubCliAsync("auth status", cancellationToken);
            return result.Success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to check GitHub CLI authentication status");
            throw;
        }
    }

    public async Task<string> GetCurrentUserAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await ProcessHelper.RunGitHubCliAsync("api user --jq .login", cancellationToken);
            return result.Output;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get current GitHub user");
            throw;
        }
    }

    public async Task<string> GetDefaultBranchAsync(string owner, string repo, CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await ProcessHelper.RunGitHubCliAsync(
                $"api repos/{owner}/{repo} --jq .default_branch",
                cancellationToken);

            return result.Output;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get default branch for {Owner}/{Repo}", owner, repo);
            throw;
        }
    }

    public async Task<string> GetLatestCommitShaAsync(
        string owner,
        string repo,
        string branch,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await ProcessHelper.RunGitHubCliAsync(
                $"api repos/{owner}/{repo}/git/refs/heads/{branch} --jq .object.sha",
                cancellationToken);

            return result.Output;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get latest commit SHA for {Owner}/{Repo}:{Branch}", owner, repo, branch);
            throw;
        }
    }

    public async Task<bool> CreateBranchAsync(
        string owner,
        string repo,
        string branchName,
        string fromSha,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await ProcessHelper.RunGitHubCliAsync(
                $"api --method POST repos/{owner}/{repo}/git/refs -f ref=refs/heads/{branchName} -f sha={fromSha}",
                cancellationToken);

            return result.Success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create branch {BranchName} in {Owner}/{Repo}", branchName, owner, repo);
            throw;
        }
    }

    public async Task<GitHubFileContent?> GetFileContentAsync(
        string owner,
        string repo,
        string filePath,
        string branch,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await ProcessHelper.RunGitHubCliAsync(
                $"api -H \"Accept: application/vnd.github.object+json\" repos/{owner}/{repo}/contents/{filePath}?ref={branch}",
                cancellationToken);

            if (!result.Success)
                return null;

            var jsonDoc = JsonDocument.Parse(result.Output);
            var root = jsonDoc.RootElement;

            var contentBase64 = root.GetProperty("content").GetString() ?? string.Empty;
            var sha = root.GetProperty("sha").GetString() ?? string.Empty;
            var decodedContent = Encoding.UTF8.GetString(Convert.FromBase64String(contentBase64.Replace("\n", "")));

            return new GitHubFileContent(sha, decodedContent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get file content for {FilePath} in {Owner}/{Repo}:{Branch}", filePath, owner, repo, branch);
            throw;
        }
    }

    public async Task<bool> UpdateFileAsync(
        string owner,
        string repo,
        string filePath,
        string fileContent,
        string currentSha,
        string branch,
        string commitMessage,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var encodedContent = Convert.ToBase64String(Encoding.UTF8.GetBytes(fileContent));

            var result = await ProcessHelper.RunGitHubCliAsync(
                $"api --method PUT /repos/{owner}/{repo}/contents/{filePath} -f message=\"{commitMessage}\" -f content={encodedContent} -f sha={currentSha} -f branch={branch}",
                cancellationToken);

            return result.Success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update file {FilePath} in {Owner}/{Repo}:{Branch}", filePath, owner, repo, branch);
            throw;
        }
    }

    public async Task<bool> CreatePullRequestAsync(
        string owner,
        string repo,
        string title,
        string body,
        string headBranch,
        string baseBranch,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await ProcessHelper.RunGitHubCliAsync(
                $"pr create --repo {owner}/{repo} --draft --title \"{title}\" --body \"{body}\" --head {headBranch} --base {baseBranch}",
                cancellationToken);

            if (result.Success)
                _logger.LogInformation("Successfully created pull request: {Title} - {Link}", title, result.Output);
            else
                _logger.LogError("Failed to create pull request. Error: {Error}", result.Error);

            return result.Success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create pull request {Title} in {Owner}/{Repo}", title, owner, repo);
            throw;
        }
    }

    public async Task<bool> CreatePublicRepositoryAsync(
        string organization,
        string name,
        string description,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await ProcessHelper.RunGitHubCliAsync(
                $"repo create {organization}/{name} --add-readme -d \"{description}\" --disable-wiki --disable-issues --public",
                cancellationToken);

            if (result.Success)
                _logger.LogInformation("Successfully created a new public repository: '{link}'", result.Output);
            else
                _logger.LogError("Failed to create a new public repository '{org}/{name}'", organization, name);

            return result.Success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create a new public repository '{org}/{name}'", organization, name);
            throw;
        }
    }

    public async Task CreateGitHubEnvironmentAsync(
        string owner,
        string name,
        string environment,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await ProcessHelper.RunGitHubCliAsync(
                $"api --method PUT repos/{owner}/{name}/environments/{environment}",
                cancellationToken);

            if (result.Success)
                _logger.LogInformation("Successfully created a new environment in repository '{org}/{name}:{env}'", owner, name, result.Output);
            else
                _logger.LogError("Failed to create a new environment in repository '{org}/{name}:{env}'", owner, name, environment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create a new GitHub environment in repository '{org}/{name}:{env}'", owner, name, environment);
            throw;
        }
    }

    public async Task CreateGitHubVariableAsync(
        string owner,
        string repo,
        string name,
        string value,
        string? environment = null,
        bool isSecret = false,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var command = new StringBuilder(isSecret ? "secret set" : "variable set");
            command.Append(' ');
            command.Append($"{name} --repo {owner}/{repo} --body \"{value}\"");

            if (!string.IsNullOrWhiteSpace(environment))
            {
                command.Append(' ');
                command.Append($"--env {environment}");
                command.Append(' ');
                command.Append($"--app actions");
            }

            var result = await ProcessHelper.RunGitHubCliAsync(
                command.ToString(),
                cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create variable public repository '{org}/{name}'", owner, name);
            throw;
        }
    }
}

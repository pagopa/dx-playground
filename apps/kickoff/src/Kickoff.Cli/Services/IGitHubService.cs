namespace Kickoff.Cli.Services;

public interface IGitHubService
{
    /// <summary>
    /// Check if GitHub CLI is authenticated
    /// </summary>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns>True if authenticated, false otherwise</returns>
    Task<bool> IsAuthenticatedAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Get the default branch of a repository
    /// </summary>
    /// <param name="owner">Repository owner</param>
    /// <param name="repo">Repository name</param>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns>Default branch name</returns>
    Task<string> GetDefaultBranchAsync(string owner, string repo, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get the latest commit SHA for a branch
    /// </summary>
    /// <param name="owner">Repository owner</param>
    /// <param name="repo">Repository name</param>
    /// <param name="branch">Branch name</param>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns>Commit SHA</returns>
    Task<string> GetLatestCommitShaAsync(string owner, string repo, string branch, CancellationToken cancellationToken = default);

    /// <summary>
    /// Create a new branch from a commit SHA
    /// </summary>
    /// <param name="owner">Repository owner</param>
    /// <param name="repo">Repository name</param>
    /// <param name="branchName">New branch name</param>
    /// <param name="fromSha">Source commit SHA</param>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns>True if successful</returns>
    Task<bool> CreateBranchAsync(string owner, string repo, string branchName, string fromSha, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get file content from repository
    /// </summary>
    /// <param name="owner">Repository owner</param>
    /// <param name="repo">Repository name</param>
    /// <param name="filePath">Path to file</param>
    /// <param name="branch">Branch name</param>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns>File content and SHA</returns>
    Task<GitHubFileContent?> GetFileContentAsync(
        string owner,
        string repo,
        string filePath,
        string branch,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Update file content in repository
    /// </summary>
    /// <param name="owner">Repository owner</param>
    /// <param name="repo">Repository name</param>
    /// <param name="filePath">Path to file</param>
    /// <param name="content">New file content</param>
    /// <param name="currentSha">Current file SHA</param>
    /// <param name="branch">Target branch</param>
    /// <param name="commitMessage">Commit message</param>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns>True if successful</returns>
    Task<bool> UpdateFileAsync(
        string owner,
        string repo,
        string filePath,
        string content,
        string currentSha,
        string branch,
        string commitMessage,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Create a pull request
    /// </summary>
    /// <param name="owner">Repository owner</param>
    /// <param name="repo">Repository name</param>
    /// <param name="title">PR title</param>
    /// <param name="body">PR body</param>
    /// <param name="headBranch">Source branch</param>
    /// <param name="baseBranch">Target branch</param>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns>True if successful</returns>
    Task<bool> CreatePullRequestAsync(
        string owner,
        string repo,
        string title,
        string body,
        string headBranch,
        string baseBranch,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Create a new public repository
    /// </summary>
    /// <param name="owner">Repository owner</param>
    /// <param name="name">Repository name</param>
    /// <param name="description">Repository description</param>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns></returns>
    Task<bool> CreatePublicRepositoryAsync(
        string owner,
        string name,
        string description,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Create a GitHub Environment
    /// </summary>
    /// <param name="owner">Repository owner</param>
    /// <param name="name">Repository name</param>
    /// <param name="environment">Name of the environment</param>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns></returns>
    Task CreateGitHubEnvironmentAsync(
        string owner,
        string name,
        string environment,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Create a variable in GitHub repository
    /// </summary>
    /// <param name="owner">Repository owner</param>
    /// <param name="repo">Repository name</param>
    /// <param name="name">Variable name</param>
    /// <param name="value">Variable value</param>
    /// <param name="environment">(Optional) Bind the variable with an environment. Default is null</param>
    /// <param name="isSecret">(Optional) Set the variable as secret. Default is false</param>
    /// <param name="cancellationToken">(Optional) Cancellation token</param>
    /// <returns></returns>
    Task CreateGitHubVariableAsync(
        string owner,
        string repo,
        string name,
        string value,
        string? environment = null,
        bool isSecret = false,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Represents the content of a file in a GitHub repository
/// </summary>
/// <param name="sha">SHA of the file content</param>
/// <param name="content">File content in plan text format</param>
public class GitHubFileContent(string sha, string content)
{
    /// <summary>
    /// File content in plain text format
    /// </summary>
    public string Content { get; } = content;

    /// <summary>
    /// SHA of the file content
    /// </summary>
    public string Sha { get; } = sha;
}

using System.Diagnostics;
using System.Text;

namespace Kickoff.Cli.Helpers;

public static class ProcessHelper
{
    public static async Task<ProcessResult> RunCommandAsync(
        string fileName,
        string arguments,
        CancellationToken cancellationToken = default)
    {
        using var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = fileName,
                Arguments = arguments,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            }
        };

        var outputBuilder = new StringBuilder();
        var errorBuilder = new StringBuilder();

        process.OutputDataReceived += (sender, e) =>
        {
            if (e.Data != null)
                outputBuilder.AppendLine(e.Data);
        };

        process.ErrorDataReceived += (sender, e) =>
        {
            if (e.Data != null)
                errorBuilder.AppendLine(e.Data);
        };

        process.Start();
        process.BeginOutputReadLine();
        process.BeginErrorReadLine();

        await process.WaitForExitAsync(cancellationToken);

        return new ProcessResult
        {
            ExitCode = process.ExitCode,
            Output = outputBuilder.ToString().Trim(),
            Error = errorBuilder.ToString().Trim(),
            Success = process.ExitCode == 0
        };
    }

    public static async Task<ProcessResult> RunGitHubCliAsync(
        string arguments,
        CancellationToken cancellationToken = default)
    {
        return await RunCommandAsync("gh", arguments, cancellationToken);
    }
}

public class ProcessResult
{
    public int ExitCode { get; set; }
    public string Output { get; set; } = string.Empty;
    public string Error { get; set; } = string.Empty;
    public bool Success { get; set; }
}

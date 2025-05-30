import * as core from "@actions/core";
import * as github from "@actions/github";

const run = async () => {
  const pr = github.context.payload.pull_request;
  if (!pr) return core.warning("Not a pull_request event.");

  const token = process.env.GITHUB_TOKEN;
  if (!token) return core.setFailed("Missing GITHUB_TOKEN");

  const { owner, repo } = github.context.repo;
  const octokit = github.getOctokit(token);

  const { data: commits } = await octokit.rest.pulls.listCommits({
    owner,
    pull_number: pr.number,
    repo,
  });

  const hasUnsignedCommits = commits.some(
    ({ commit }) => commit.author?.name && !commit.verification?.verified,
  );

  if (hasUnsignedCommits) {
    core.notice("🔐 Some commits in this PR are not signed.");
    core.info(
      "✍️ Signed commits help ensure the authenticity of changes and improve our team's trust in the commit history.",
    );
    core.notice(
      "💡 You can enable commit signing by following this guide: https://pagopa.github.io/dx/docs/conventions/git/git-config#signed-commits",
    );
    core.info(
      "✨ If you're using GitHub CLI, you can set up SSH or GPG signing in a few steps and have it done automatically!",
    );
  } else {
    core.info("✅ Awesome! All commits are signed. Thanks! 🙌");
  }
};

run();

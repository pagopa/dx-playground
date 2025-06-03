import * as core from "@actions/core";
import { enterPre, exitPre } from "@changesets/pre";
import {
  publish as publishPackages,
  readChangesetState,
  version as versionPackages,
} from "@changesets/release-utils";

const run = async () => {
  const workDir = core.getInput("workDir", {
    required: true,
    trimWhitespace: true,
  });
  const preReleaseTag = core.getInput("releaseType", {
    required: true,
    trimWhitespace: true,
  });
  core.debug(`Working directory: ${workDir}`);

  const { changesets, preState } = await readChangesetState(workDir);
  core.debug(`PreState: ${JSON.stringify(preState, null, 2)}`);
  core.debug(`Changesets: ${JSON.stringify(changesets, null, 2)}`);

  if (!preState || preState.mode === "exit") {
    core.info("It is possible to enter the pre-release mode");
    core.info(`Enter pre-release mode with ${preReleaseTag} tag`);
    await enterPre(workDir, preReleaseTag);

    core.info("Versioning the packages...");
    const versionResult = await versionPackages({
      commitMessage: `Prepare packages ${preReleaseTag} version`,
      cwd: workDir,
      script: "yarn run version",
    });
    core.debug(`Version result: ${JSON.stringify(versionResult, null, 2)}`);
    core.info("Publishing the packages...");
    const publishResult = await publishPackages({
      cwd: workDir,
      script: "yarn run release",
    });
    core.debug(`Publish result: ${JSON.stringify(publishResult, null, 2)}`);

    core.info("Exit pre-release mode");
    await exitPre(workDir);
  } else {
    core.warning("Already in pre-release mode");
  }
};

run();

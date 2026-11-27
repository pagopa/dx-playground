// Test-only Nx versionActions for the release probe (DO NOT MERGE). The probe
// is never versioned; this only lets `nx release publish` resolve its config
// without adding @nx/js to the workspace.
const { VersionActions } = require("nx/release");

const unsupported = async () => {
  throw new Error("hardening-release-probe must never be versioned");
};

class ProbeVersionActions extends VersionActions {
  validManifestFilenames = null;
  readCurrentVersionFromSourceManifest = unsupported;
  readCurrentVersionFromRegistry = unsupported;
  readCurrentVersionOfDependency = async () => ({
    currentVersion: null,
    dependencyCollection: null,
  });
  updateProjectVersion = unsupported;
  updateProjectDependencies = async () => [];
}

module.exports = ProbeVersionActions;
module.exports.default = ProbeVersionActions;

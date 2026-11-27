#!/usr/bin/env bash
# Test-only publish probe for the DX release-v2 hardening (DO NOT MERGE).
set -euo pipefail

fail() {
  echo "::error::$*" >&2
  exit 1
}

for name in GH_APP_KEY GH_APP_CLIENT_ID GH_APP_ID GH_APP_INSTALLATION_ID \
  GH_APP_PRIVATE_KEY; do
  if printenv "$name" > /dev/null; then
    fail "$name is set in the nx-release publish step"
  fi
done
echo "No GH_APP_* variable is present in the publish step."

: "${GH_TOKEN:?GH_TOKEN (GitHub App token for gh/Octokit) is missing}"
npmrc="${NPM_CONFIG_USERCONFIG:?setup-npm-registry did not set NPM_CONFIG_USERCONFIG}"
registry_token="$(sed -n 's#^//npm.pkg.github.com/:_authToken=##p' "$npmrc")"
[[ -n "$registry_token" ]] || fail "No GitHub Packages token in $npmrc"
[[ "$registry_token" != "$GH_TOKEN" ]] ||
  fail "GitHub Packages uses the GitHub App token instead of github.token"
echo "GitHub Packages token differs from the GitHub App token (GH_TOKEN)."

# whoami is read-only and fails with 403 for a token GitHub Packages rejects.
identity="$(npm whoami --registry https://npm.pkg.github.com)" ||
  fail "GitHub Packages rejected the github.token credential"
echo "GitHub Packages authenticated the workflow token as: $identity"

cd "$(dirname "$0")"
# Provenance is disabled so the dry run never writes to a transparency log.
NPM_CONFIG_PROVENANCE=false npm publish --dry-run --tag hardening-test
echo "Dry-run publish completed; nothing was published."

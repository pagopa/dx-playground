# Release v2 hardening probe (test only, DO NOT MERGE)

The `nx-release-publish` target never publishes. It runs inside the DX
`nx-release` publish step and checks that the step has no GitHub App
credentials, that GitHub Packages is authenticated with the workflow token
written by `setup-npm-registry` (not the App token), and then runs
`npm publish --dry-run`.

# DX Playground

## Requirements

This project requires specific versions of the following tools.  
To make sure your development setup matches with production follow the recommended installation methods.

### Node.js
Use [nodenv](https://github.com/nodenv/nodenv) to install the required
version of Node.js from `.node-version`.  
Once you've installed `nodenv`, run the following script:
```shell
nodenv install
# Check the installed version
node -v
```

### pnpm
pnpm must be installed using [Corepack](https://pnpm.io/getting-started/install), included by default in `Node.js`.

```shell
corepack enable
# Check the installed version
pnpm -v
```

### Terraform
Use [tfenv](https://github.com/tfutils/tfenv) to install [the desired version of Terraform](https://github.com/pagopa/dx-playground/blob/main/.terraform-version).  
Once you've installed `tfenv`, execute the following commands:
```shell
tfenv install
# Check the installed version
terraform -v
```

## Folder structure

### `/apps`

It contains the applications included in the project. Each folder is meant to produce a deployable artifact; how and where to deploy it is demanded to a single application.

Each sub-folder is a workspace.

### `/packages`

Packages are reusable TypeScript modules that implement a specific logic of the project. They are meant for sharing implementations across other apps and packages of the same projects, as well as being published in public registries.

Packages that are meant for internal code sharing have `private: true` in their package.json file; all the others are meant to be published into the public registry.

Each sub-folder is a workspace.

### `/infra`

It contains the _infrastructure-as-code_ project that defines the resources for the project as well as the execution environments.  
Database schemas and migrations are defined here too, in case they are needed.

## Development

The pnpm workspaces are orchestrated by [Nx](https://nx.dev). Common commands
run the matching target across the workspace:

```shell
pnpm build
pnpm typecheck
pnpm lint
pnpm test
pnpm code-review
```

Use `pnpm nx show projects` to list projects and `pnpm nx affected` to run
targets only for projects changed from the configured base branch.

## Releases

Releases use [Nx Release version plans](https://nx.dev/features/manage-releases).
Projects are versioned independently and retain the
`{projectName}@{version}` tag format used by deployment workflows.

#### How it works

- Add a version plan for a releasable change with `pnpm release:plan`.
- The plan is written under `.nx/version-plans/` and checked on pull requests.
- After merge, the DX release workflow opens or updates the `Version Packages`
  pull request.
- Merging `Version Packages` publishes the release tags and GitHub releases.

## GitHub App authentication

The DX release workflows use the repository secrets
`GH_APP_RELEASE_CLIENT_ID` and `GH_APP_RELEASE_APP_KEY`. Bootstrapper workflows
use `GH_APP_CLIENT_ID`, `GH_APP_KEY`, and `GH_APP_INSTALLATION_ID`.

The Azure self-hosted runner reads these credentials from the shared Key Vault:

- `github-runner-app-id`
- `github-runner-app-installation-id`
- `github-runner-app-key`

The DX Terraform module maps them at runtime to `GITHUB_APP_ID`,
`GITHUB_APP_INSTALLATION_ID`, and `GITHUB_APP_KEY`, and configures
`REGISTRATION_TOKEN_API_URL`. Secret values must be populated through approved
secure channels and must never be committed.

The AWS CodeBuild runner remains on its existing SSM-backed PAT because the
current stable AWS bootstrap contract does not expose the runner-container
GitHub App inputs and the shared core state does not export a CodeConnection
ARN.

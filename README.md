# DX Playground

## Requirements

This project requires specific versions of the following tools.  
To make sure your development setup matches with production follow the recommended installation methods.

### Node.js
Use [nodenv](https://github.com/nodenv/nodenv) to install the required version of Node.js.  
Once you've installed `nodenv`, run the following script:
```shell
nodenv install
# Check the installed version
node -v
```

### Yarn
Yarn must be installed using [Corepack](https://yarnpkg.com/getting-started/install), included by default in `Node.js`.

```shell
corepack enable
# Check the installd version
yarn -v
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

### `/app`

It contains the applications included in the project. Each folder is meant to produce a deployable artifact; how and where to deploy it is demanded to a single application.

Each sub-folder is a workspace.

### `/packages`

Packages are reusable TypeScript modules that implement a specific logic of the project. They are meant for sharing implementations across other apps and packages of the same projects, as well as being published in public registries.

Packages that are meant for internal code sharing have `private: true` in their package.json file; all the others are meant to be published into the public registry.

Each sub-folder is a workspace.

### `/infra`

It contains the _infrastructure-as-code_ project that defines the resources for the project as well as the execution environments.  
Database schemas and migrations are defined here too, in case they are needed.


## Releases

Releases are handled using [Changeset](https://github.com/changesets/changesets).
Changeset takes care of bumping packages, updating the changelog, and tag the repository accordingly.

#### How it works

- When opening a Pull Request with a change intended to be published, [add a changeset file](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) to the proposed changes.
- Once the Pull Request is merged, a new Pull Request named `Version Packages` will be automatically opened with all the release changes such as version bumping for each involved app or package and changelog update; if an open `Version Packages` PR already exists, it will be updated and the package versions calculated accordingly (see https://github.com/changesets/changesets/blob/main/docs/decisions.md#how-changesets-are-combined).
  Only apps and packages mentioned in the changeset files will be bumped.
- Review the `Version Packages` PR and merge it when ready. Changeset files will be deleted.
- A Release entry is created for each app or package whose version has been bumped.

> [!TIP]  
> You can also set up the [Changeset bot](https://github.com/apps/changeset-bot) to alert you with a warning message (for example, [this one](https://github.com/pagopa/dx-playground/pull/9#issuecomment-2507383352)) if a changeset is missing.  
> Additionally, the bot provides the capability to create a changeset file directly through the GitHub user interface.  

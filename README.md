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
# Check the installd version
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

## SRE Agent

### Agents

| Online | Yaml                                                                                                                               | Description                                                                                                                                                                                                                                                                                                                                          |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|        | [incident-handler-core.yaml](https://github.com/dm-chelupati/sre-agent-lab/blob/main/sre-config/agents/incident-handler-core.yaml) | Read/Write, basic triage, execute runbooks                                                                                                                                                                                                                                                                                                           |
|        | [incident-handler-full.yaml](https://github.com/dm-chelupati/sre-agent-lab/blob/main/sre-config/agents/incident-handler-full.yaml) | Read/Write, basic triage, execute runbooks, create incidents on GitHub issues with findings using `github incident template` template. Plot charts                                                                                                                                                                                                   |
| X      | [code-analyzer.yaml](https://github.com/yortch/agentic-devops-demo/blob/main/sre/sre-config/agents/code-analyzer.yaml)             | Read/Write, correlate code with infrastructure, create incidents on GitHub issues assigning them to Copilot Cloud Agent. Do not work on Git. Knowledge of repository structure.                                                                                                                                                                      |
| X      | [incident-handler-2.yaml](https://github.com/yortch/agentic-devops-demo/blob/main/sre/sre-config/agents/incident-handler.yaml)     | Read/Write, correlate code with infrastructure, create incidents on GitHub issues assigning them to Copilot Cloud Agent, checks for duplicated first and update the same in case of new events. Do not work on Git. Knowledge of repository structure.                                                                                               |
|        | github-issue-incident-manager.yaml                                                                                                 | Read/Write, can be invoked only another agent already working on a Azure Monitor alert. correlate code with infrastructure, create incidents on GitHub issues with findings using `github incident template` template, checks for duplicated first and update the same in case of new events. Do not work on Git. Knowledge of repository structure. |

### Knowledge Base

| Online | Markdown                                                                                                                                                                     | Description                                                                                                                                                                    |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| X      | github-incident-template.md, inspired from [incident-report-template.md](https://github.com/dm-chelupati/sre-agent-lab/blob/main/knowledge-base/incident-report-template.md) | Template for GitHub issues to track incidents triggered by Azure Monitor alerts. The issue should include all relevant information to facilitate investigation and resolution. |
| X      | 500-spikes-runbook.md                                                                                                                                                        | Behavior to check for 500 spikes in the application. It is a runbook to be executed by the SRE Agent.                                                                          |
| X      | app-architecture.md                                                                                                                                                          | Application architecture and design decisions. It is a runbook to be executed by the SRE Agent.                                                                                |
| X      | cosmos-ru-consumption-runbook.md                                                                                                                                             | Behavior to check for RU consumption in Cosmos DB. It is a runbook to be executed by the SRE Agent.                                                                            |

### Incident Response Plans

| Online | On/Off | Name                 | Severity     | Title contains | Title does not contain | Subagent           | Autonomy   |
| ------ | ------ | -------------------- | ------------ | -------------- | ---------------------- | ------------------ | ---------- |
| X      | Off    | Generic              | All severity |                |                        | incident-handler   | Review     |
| X      | On     | DX To-Do HTTP Errors | All Severity |                |                        | incident-handler 2 | Autonomous |

### Tasks

| Online | On/Off | Name                             | Subagent | Task Detail       | Model Tier      | Autonomy   |
| ------ | ------ | -------------------------------- | -------- | ----------------- | --------------- | ---------- |
| X      | On     | dx-todo-health-check             |          | health-check.yaml | General Purpose | Autonomous |
| X      | On     | dx-todo-daily-reliability-report |          | daily-report.yaml | General Purpose | Autonomous |

### Connectors

| Online | Name   | Yaml                                                                                                                 | Description                                                                                                 |
| ------ | ------ | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| X      | GitHub | [github-oauth.yaml](https://github.com/dm-chelupati/sre-agent-lab/blob/main/sre-config/connectors/github-oauth.yaml) | GitHub OAuth connector for creating and managing issues in the pagopa/dx-playground using OAuth repository. |

### Helpful links

- [sre-agent](https://github.com/microsoft/sre-agent)
- [sre-agent-lab](https://github.com/dm-chelupati/sre-agent-lab)
- [agentic-devops-demo](https://github.com/yortch/agentic-devops-demo)
- [HTTP Triggers in Azure SRE Agent: From Jira Ticket to Automated Investigation](https://techcommunity.microsoft.com/blog/appsonazureblog/http-triggers-in-azure-sre-agent-from-jira-ticket-to-automated-investigation/4504960)
- [Get started with Atlassian Rovo MCP server in Azure SRE Agent](https://techcommunity.microsoft.com/blog/appsonazureblog/get-started-with-atlassian-rovo-mcp-server-in-azure-sre-agent/4497122)

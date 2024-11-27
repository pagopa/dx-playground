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

### `/infra`

It contains the _infrastructure-as-code_ project that defines the resources for the project as well as the execution environments.  
Database schemas and migrations are defined here too, in case they are needed.

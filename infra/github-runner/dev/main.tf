terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "<= 3.117.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "tfdevdx"
    container_name       = "terraform-state"
    key                  = "dx-playground.github-runner.dev.tfstate"
  }
}

provider "azurerm" {
  features {}
}

module "container_app_job_selfhosted_runner" {
  source = "github.com/pagopa/dx//infra/modules/github_selfhosted_runner_on_container_app_jobs?ref=8d43d6db2ba632607ac2814c0dca5193d96065fb" # FIXME: When PR has been merged, get the SHA from main branch

  environment = {
    prefix          = local.prefix
    env_short       = local.env_short
    location        = local.location
    instance_number = local.suffix
  }

  resource_group_name = data.azurerm_resource_group.gh_runner.name

  repository = {
    name = local.repo_name
  }

  container_app_environment = {
    id       = data.azurerm_container_app_environment.gh_runner.id
    location = local.location
  }

  key_vault = {
    name                = data.azurerm_key_vault.key_vault.name
    resource_group_name = data.azurerm_key_vault.key_vault.resource_group_name
    use_rbac            = true
  }

  tags = local.tags
}

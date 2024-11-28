terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "<= 3.100.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "tfdevdx"
    container_name       = "terraform-state"
    key                  = "dx-playground.github-runner.dev.italynorth.tfstate"
  }
}

provider "azurerm" {
  features {}
}

module "container_app_job_self_hosted_runner" {
  source = "github.com/pagopa/dx//infra/modules/github_selfhosted_runner_on_container_app_jobs?ref=f99b2fcb921aed8d39774112710f303169cb6e41"

  prefix    = local.prefix
  env_short = local.env_short

  repo_name = local.repo_name

  container_app_environment = {
    name                = "${local.prefix}-${local.env_short}-github-runner-cae"
    resource_group_name = "${local.prefix}-${local.env_short}-github-runner-rg"
  }

  key_vault = {
    // TODO: Replace values with the resources coming from the "core" module
    name                = "${local.prefix}-${local.env_short}-kv-common"
    resource_group_name = "${local.prefix}-${local.env_short}-rg-common"
  }

  tags = local.tags
}

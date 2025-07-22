terraform {
  backend "azurerm" {
    resource_group_name  = "dx-d-itn-tfstate-rg-01"
    storage_account_name = "dxditntfstatest01"
    container_name       = "terraform-state"
    key                  = "dx.storage_account.demo.radius.tfstate"
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>4"
    }
    dx = {
      source  = "pagopa-dx/azure"
      version = ">= 0.0.6, < 1.0.0"
    }
  }
}

provider "azurerm" {
  features {}
}

provider "dx" {}

## Locals

locals {
  environment = {
    prefix          = "dx"
    env_short       = "d"
    location        = "italynorth"
    domain          = "radius"
    app_name        = "demo"
    instance_number = "02"
  }

  naming_config = {
    prefix          = local.environment.prefix
    environment     = local.environment.env_short
    location        = local.environment.location
    domain          = local.environment.domain
    name            = local.environment.app_name
    instance_number = tonumber(local.environment.instance_number)
  }

  virtual_network = {
    name = provider::dx::resource_name(merge(local.naming_config, {
      domain        = null,
      name          = "common",
      resource_type = "virtual_network",
      instance_number = 1
    }))
    resource_group_name = provider::dx::resource_name(merge(local.naming_config, {
      domain        = null,
      name          = "network",
      resource_type = "resource_group",
      instance_number = 1
    }))
  }

  resource_group_name = var.resource_group_name == "" ? provider::dx::resource_name(merge(local.naming_config, {
    domain        = null,
    name          = "test",
    resource_type = "resource_group",
    instance_number = "01"
  })) : var.resource_group_name

  tags = {
    CostCenter     = "TS000 - Tecnologia e Servizi"
    CreatedBy      = "Terraform"
    Environment    = "Dev"
    Source         = "https://github.com/pagopa/dx/demo/radius"
    ManagementTeam = "Developer Experience"
    BusinessUnit   = "DevEx"
    Scope          = "Radius Recipes Test"
  }
}

## Resources

data "azurerm_subnet" "pep" {
  name = provider::dx::resource_name(merge(local.naming_config, {
    domain        = null,
    name          = "pep",
    resource_type = "subnet",
    instance_number = 1
  }))
  virtual_network_name = local.virtual_network.name
  resource_group_name  = local.virtual_network.resource_group_name
}

module "azure_storage_account" {
  source = "pagopa-dx/azure-storage-account/azurerm"

  environment         = local.environment
  tier                = "s"
  resource_group_name = local.resource_group_name

  subnet_pep_id                        = data.azurerm_subnet.pep.id
  private_dns_zone_resource_group_name = local.virtual_network.resource_group_name

  customer_managed_key = {
    enabled = false
  }

  force_public_network_access_enabled = false

  subservices_enabled = {
    blob  = false
    file  = false
    queue = false
    table = false
  }

  tags = local.tags
}

##  Variables

variable "resource_group_name" {
  description = "The name of the resource group where the storage account will be created."
  type        = string
  default     = ""
}

## Outputs

output "storage_account_id" {
  value = module.azure_storage_account.id
}

output "storage_account_name" {
  value = module.azure_storage_account.name
}

output "storage_account_rg" {
  value = module.azure_storage_account.resource_group_name
}
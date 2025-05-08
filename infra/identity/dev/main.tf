terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>4"
    }
  }

  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "tfdevdx"
    container_name       = "terraform-state"
    key                  = "dx-playground.identity.dev.italynorth.tfstate"
  }
}

provider "azurerm" {
  features {}
}

data "azurerm_subscription" "current" {}

resource "azurerm_resource_group" "rg_identity" {
  name     = "${local.project}-identity-rg-${local.instance_number}"
  location = local.location

  tags = local.tags
}

module "federated_identities" {
  source  = "pagopa-dx/azure-federated-identity-with-github/azurerm"
  version = "1.0.3"

  environment = {
    prefix          = local.prefix
    env_short       = local.env_short
    location        = local.location
    domain          = local.domain
    instance_number = local.instance_number
  }

  repository = {
    name = local.repo_name
  }

  resource_group_name = azurerm_resource_group.rg_identity.name

  subscription_id = data.azurerm_subscription.current.id

  continuos_integration = {
    enable = true
    roles = {
      subscription = [
        "Reader",
        "Reader and Data Access",
        "PagoPA IaC Reader",
        "DocumentDB Account Contributor",
        "API Management Service Contributor",
      ]
      resource_groups = {
        terraform-state-rg = [
          "Storage Blob Data Contributor"
        ]
      }
    }
  }

  tags = local.tags

  depends_on = [
    azurerm_resource_group.rg_identity
  ]
}

module "backend_federated_identities" {
  source  = "pagopa-dx/azure-federated-identity-with-github/azurerm"
  version = "1.0.3"

  environment = {
    prefix          = local.prefix
    env_short       = local.env_short
    location        = local.location
    domain          = "${local.domain}-app"
    instance_number = local.instance_number
  }
  repository = {
    name = local.repo_name
  }
  subscription_id     = data.azurerm_subscription.current.id
  resource_group_name = azurerm_resource_group.rg_identity.name
  tags                = local.tags

  continuos_integration = { enable = false }
}

module "roles_ci" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "1.0.3"

  principal_id    = module.federated_identities.federated_ci_identity.principal_id
  subscription_id = data.azurerm_subscription.current.subscription_id

  key_vault = [
    {
      name                = "${local.prefix}-${local.env_short}-${local.location_short}-common-kv-01"
      resource_group_name = "${local.prefix}-${local.env_short}-${local.location_short}-common-rg-01"
      description         = "Allow dx-playground repo CI to read secrets"
      roles = {
        secrets = "reader"
      }
    }
  ]
}

module "roles_cd" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "1.0.3"

  principal_id    = module.federated_identities.federated_cd_identity.principal_id
  subscription_id = data.azurerm_subscription.current.subscription_id

  key_vault = [
    {
      name                = "${local.prefix}-${local.env_short}-${local.location_short}-common-kv-01"
      resource_group_name = "${local.prefix}-${local.env_short}-${local.location_short}-common-rg-01"
      description         = "Allow dx-playground repo CD to read secrets"
      roles = {
        secrets = "reader"
      }
    }
  ]

  storage_blob = [
    {
      storage_account_name = "dxditnplaygrounddfstfd01"
      resource_group_name  = "${local.prefix}-${local.env_short}-${local.location_short}-test-rg-01"
      description          = "Allow dx-playground repo CD to be owner of the storage account"
      role                 = "owner"
    },
    {
      storage_account_name = "dxditnplaygrounddfstfn01"
      resource_group_name  = "${local.prefix}-${local.env_short}-${local.location_short}-test-rg-01"
      description          = "Allow dx-playground repo CD to be owner of the storage account"
      role                 = "owner"
    }
  ]

  storage_queue = [
    {
      storage_account_name = "dxditnplaygrounddfstfd01"
      resource_group_name  = "${local.prefix}-${local.env_short}-${local.location_short}-test-rg-01"
      description          = "Allow dx-playground repo CD to be owner of the storage account"
      role                 = "owner"
    },
    {
      storage_account_name = "dxditnplaygrounddfstfn01"
      resource_group_name  = "${local.prefix}-${local.env_short}-${local.location_short}-test-rg-01"
      description          = "Allow dx-playground repo CD to be owner of the storage account"
      role                 = "owner"
    }
  ]

  storage_table = [
    {
      storage_account_name = "dxditnplaygrounddfstfd01"
      resource_group_name  = "${local.prefix}-${local.env_short}-${local.location_short}-test-rg-01"
      description          = "Allow dx-playground repo CD to be owner of the storage account"
      role                 = "owner"
    },
    {
      storage_account_name = "dxditnplaygrounddfstfn01"
      resource_group_name  = "${local.prefix}-${local.env_short}-${local.location_short}-test-rg-01"
      description          = "Allow dx-playground repo CD to be owner of the storage account"
      role                 = "owner"
    }
  ]
}

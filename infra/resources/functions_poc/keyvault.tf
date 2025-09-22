resource "azurerm_key_vault" "this" {
  name                = "dx-d-itn-poc-func-kv-01"
  resource_group_name = azurerm_resource_group.devandreag.name
  location            = local.environment.location

  sku_name                      = "standard"
  tenant_id                     = data.azurerm_subscription.current.tenant_id
  rbac_authorization_enabled    = true
  purge_protection_enabled      = false
  public_network_access_enabled = true
  soft_delete_retention_days    = 7

  tags = local.tags
}

module "me_role_assignments" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 1.2"

  principal_id = "58e3c6d6-c60a-4147-ac68-5636f50012c3"

  subscription_id = data.azurerm_subscription.current.subscription_id

  key_vault = [
    {
      name                = azurerm_key_vault.this.name
      resource_group_name = azurerm_resource_group.devandreag.name
      has_rbac_support    = true
      description         = "give me access"
      roles = {
        secrets      = "owner"
        certificates = "owner"
        keys         = "owner"
      }
    }
  ]
}

module "func_role_assignments" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 1.2"

  principal_id = "b8f80e11-6ea1-48d6-949b-080cad757f5d"

  subscription_id = data.azurerm_subscription.current.subscription_id

  key_vault = [
    {
      name                = azurerm_key_vault.this.name
      resource_group_name = azurerm_resource_group.devandreag.name
      has_rbac_support    = true
      description         = "give access to func"
      roles = {
        secrets      = "owner"
        certificates = "owner"
        keys         = "owner"
      }
    }
  ]
}

module "func_01_role_assignments" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 1.2"

  principal_id = "20580df7-8926-4caf-9522-a446c8835806"

  subscription_id = data.azurerm_subscription.current.subscription_id

  key_vault = [
    {
      name                = azurerm_key_vault.this.name
      resource_group_name = azurerm_resource_group.devandreag.name
      has_rbac_support    = true
      description         = "give access to func"
      roles = {
        secrets      = "owner"
        certificates = "owner"
        keys         = "owner"
      }
    }
  ]
}

module "ca_role_assignments" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 1.2"

  principal_id = "ceaa44e2-9cbe-4719-8dec-e314e3ddb987"

  subscription_id = data.azurerm_subscription.current.subscription_id

  key_vault = [
    {
      name                = azurerm_key_vault.this.name
      resource_group_name = azurerm_resource_group.devandreag.name
      has_rbac_support    = true
      description         = "give access to ca"
      roles = {
        secrets      = "owner"
        certificates = "owner"
        keys         = "owner"
      }
    }
  ]
}

# module "ca_03_role_assignments" {
#   source  = "pagopa-dx/azure-role-assignments/azurerm"
#   version = "~> 1.2"

#   principal_id = "2fa2cf5b-eb86-4720-b293-bdc543bfc989"

#   subscription_id = data.azurerm_subscription.current.subscription_id

#   key_vault = [
#     {
#       name                = azurerm_key_vault.this.name
#       resource_group_name = azurerm_resource_group.devandreag.name
#       has_rbac_support    = true
#       description         = "give access to ca"
#       roles = {
#         secrets      = "owner"
#         certificates = "owner"
#         keys         = "owner"
#       }
#     }
#   ]
# }

module "appsvc_role_assignments" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 1.2"

  principal_id = "971675e0-74e6-4ce4-b3c0-9821e89c4119"

  subscription_id = data.azurerm_subscription.current.subscription_id

  key_vault = [
    {
      name                = azurerm_key_vault.this.name
      resource_group_name = azurerm_resource_group.devandreag.name
      has_rbac_support    = true
      description         = "give access to appsvc"
      roles = {
        secrets      = "owner"
        certificates = "owner"
        keys         = "owner"
      }
    }
  ]
}

module "flex_role_assignments" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 1.2"

  principal_id = "5ef46aeb-48b2-4e25-b163-87a8b7941192"

  subscription_id = data.azurerm_subscription.current.subscription_id

  key_vault = [
    {
      name                = azurerm_key_vault.this.name
      resource_group_name = azurerm_resource_group.devandreag.name
      has_rbac_support    = true
      description         = "give access to appsvc"
      roles = {
        secrets      = "owner"
        certificates = "owner"
        keys         = "owner"
      }
    }
  ]
}

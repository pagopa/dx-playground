resource "azurerm_key_vault" "vault" {
  name = provider::dx::resource_name({
    prefix          = local.environment.prefix
    environment     = local.environment.env_short,
    location        = local.environment.location,
    name            = "plygrnd",
    resource_type   = "key_vault",
    instance_number = 1,
  })
  location            = local.environment.location
  resource_group_name = local.resource_group_name
  tenant_id           = data.azurerm_subscription.current.tenant_id
  sku_name            = "standard"

  enabled_for_disk_encryption = true
  purge_protection_enabled    = true
  soft_delete_retention_days  = 7
  rbac_authorization_enabled  = true

  network_acls {
    bypass         = "AzureServices"
    default_action = "Allow" #tfsec:ignore:AZU020
  }

  tags = local.tags
}

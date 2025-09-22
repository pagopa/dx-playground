resource "azurerm_app_configuration" "this" {
  name                = "${local.project}-appcs-01"
  resource_group_name = azurerm_resource_group.this.name
  location            = local.location

  local_auth_enabled       = false
  public_network_access    = "Enabled"
  purge_protection_enabled = false

  identity {
    type = "UserAssigned"
    identity_ids = [
      azurerm_user_assigned_identity.appcs.id,
    ]
  }

  tags = local.tags

  depends_on = [
    azurerm_role_assignment.kv_appcs,
  ]
}

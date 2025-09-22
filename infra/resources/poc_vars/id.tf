resource "azurerm_user_assigned_identity" "appcs" {
  name                = "${local.project}-appcs-id-01"
  location            = local.location
  resource_group_name = azurerm_resource_group.this.name

  tags = local.tags
}

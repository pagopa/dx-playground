data "azurerm_subscription" "current" {}
data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "this" {
  name     = "${local.project}-rg-01"
  location = local.location
  tags     = local.tags
}

resource "azurerm_log_analytics_workspace" "this" {
  name                = "${local.project}-log-01"
  location            = local.location
  resource_group_name = azurerm_resource_group.this.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = local.tags
}

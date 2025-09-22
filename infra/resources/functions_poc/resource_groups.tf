resource "azurerm_resource_group" "devandreag" {
  name     = "dev-andreag"
  location = local.environment.location

  tags = local.tags
}

import {
  to = azurerm_resource_group.devandreag
  id = "/subscriptions/${data.azurerm_subscription.current.subscription_id}/resourceGroups/dev-andreag"
}

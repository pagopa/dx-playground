resource "azurerm_container_app_environment" "this" {
  name                = "${local.project}-cae-01"
  location            = local.location
  resource_group_name = azurerm_resource_group.this.name
  tags                = local.tags

  identity {
    type = "SystemAssigned"
  }

  log_analytics_workspace_id = azurerm_log_analytics_workspace.this.id

  workload_profile {
    name                  = "Consumption"
    workload_profile_type = "Consumption"
    minimum_count         = 1
    maximum_count         = 1
  }

  lifecycle {
    ignore_changes = [
      infrastructure_resource_group_name,
      workload_profile,
    ]
  }

  timeouts {
    create = "60m"
  }
}

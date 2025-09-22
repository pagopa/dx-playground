# resource "azurerm_container_app" "this" {
#   name                = "${local.project}-ca-01"
#   location            = local.location
#   resource_group_name = azurerm_resource_group.this.name
#   container_app_environment_id = azurerm_container_app_environment.this.id
#   workload_profile_name        = "Consumption"
#   tags                = local.tags

#   identity {
#     type = "SystemAssigned"
#   }

#     ingress {
#     allow_insecure_connections = false
#     external_enabled           = true
#     target_port                = 443
#     traffic_weight {
#       percentage      = 100
#       latest_revision = true
#     }
#   }

#   revision_mode = "Single"

#   template {
#     termination_grace_period_seconds = 30
#     min_replicas = 0
#     max_replicas = 1

#     container {
#       name = "app"
#       image = ""
#       cpu = "1.0"
#       memory = "2Gi"
#     }
#   }

#   lifecycle {
#     ignore_changes = [
#       # The image is not managed by Terraform, but instead updated by CD pipelines
#       template[0].container[0].image
#     ]
#   }
# }

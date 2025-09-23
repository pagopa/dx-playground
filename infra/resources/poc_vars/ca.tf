locals {
  port = 8080
}

resource "azurerm_container_app" "this" {
  name                         = "${local.project}-ca-01"
  resource_group_name          = azurerm_resource_group.this.name
  container_app_environment_id = azurerm_container_app_environment.this.id
  workload_profile_name        = "Consumption"
  tags                         = local.tags

  identity {
    type = "SystemAssigned"
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = local.port
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  revision_mode = "Single"

  template {
    termination_grace_period_seconds = 15
    min_replicas                     = 0
    max_replicas                     = 1

    container {
      name   = "poc-app"
      image  = "ghcr.io/pagopa/poc-envvars:latest"
      cpu    = "0.75"
      memory = "1.5Gi"

      startup_probe {
        failure_count_threshold = 10
        initial_delay           = 5
        interval_seconds        = 3
        path                    = "/healthz"
        port                    = local.port
        transport               = "HTTP"
      }

      liveness_probe {
        failure_count_threshold = 3
        initial_delay           = 30
        interval_seconds        = 10
        path                    = "/healthz"
        port                    = local.port
        transport               = "HTTP"
      }
    }
  }

  lifecycle {
    ignore_changes = [
      # The image is not managed by Terraform, but instead updated by CD pipelines
      template[0].container[0].image
    ]
  }
}

module "azure_core_values" {
  source  = "pagopa-dx/azure-core-values-exporter/azurerm"
  version = "~> 0.0"

  core_state = local.core_state
}

module "playground_container_app" {
  source  = "pagopa-dx/azure-container-app/azurerm"
  version = "~> 8.0"

  environment         = merge(local.environment, { app_name = "demo" })
  resource_group_name = local.resource_group_name
  use_case            = "development"

  container_app_environment_id = module.azure_core_values.github_runner.environment_id
  container_port               = 80

  containers = [
    {
      image = "nginx:latest"
      name  = "nginx"

      liveness_probe = {
        path = "/"
      }
    }
  ]

  autoscaler = {
    replicas = {
      minimum = 0
      maximum = 1
    }
  }

  authentication = {
    azure_active_directory = {
      client_id                     = data.azuread_application.entra_auth_app.client_id
      tenant_id                     = data.azurerm_subscription.current.tenant_id
      unauthenticated_client_action = "Return401"
    }
  }

  tags = local.tags
}

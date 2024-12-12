## Common
resource "azurerm_resource_group" "dynatrace_rg" {
  name     = "${module.naming_convention.prefix}-dynatrace-rg-${module.naming_convention.suffix}"
  location = local.environment.location
}

resource "azurerm_subnet" "dynatrace_snet" {
  name                 = "${module.naming_convention.prefix}-dynatrace-snet-${module.naming_convention.suffix}"
  resource_group_name  = data.azurerm_virtual_network.test_vnet.resource_group_name
  virtual_network_name = data.azurerm_virtual_network.test_vnet.name
  address_prefixes     = ["10.50.10.0/24"]
}

resource "random_password" "admin_password" {
  length  = 16
  special = true
  upper   = true
  lower   = true
  numeric = true
}

resource "azurerm_key_vault_secret" "admin_password" {
  name         = "dynatrace-vms-admin-password"
  value        = random_password.admin_password.result
  key_vault_id = data.azurerm_key_vault.common_kv.id
}

## OneAgent
# Ref. Linux https://docs.dynatrace.com/docs/ingest-from/dynatrace-oneagent/installation-and-operation/linux/installation/install-oneagent-on-linux

module "dynatrace_oneagent" {
  source = "../modules/virtual_machine"

  name                = "oneagent"
  prefix              = module.naming_convention.prefix
  suffix              = module.naming_convention.suffix
  resource_group_name = azurerm_resource_group.dynatrace_rg.name
  location            = local.environment.location

  subnet_id = azurerm_subnet.dynatrace_snet.id

  admin = {
    username = "pagopa",
    password = random_password.admin_password.result
  }

  # custom_data = <<-EOT
  #   #!/bin/bash
  #   wget -O Dynatrace-OneAgent.sh "https://<dynatrace-environment-id>.live.dynatrace.com/installer/agent/unix/latest"
  #   sudo /bin/bash Dynatrace-OneAgent.sh APP_LOG_CONTENT_ACCESS=1 INFRA_ONLY=0
  # EOT

  tags = local.tags
}

## ActiveGate
# Ref. Linux https://docs.dynatrace.com/docs/ingest-from/dynatrace-activegate/installation/linux/linux-install-an-environment-activegate

module "dynatrace_activegate" {
  source = "../modules/virtual_machine"

  name                = "activegate"
  prefix              = module.naming_convention.project
  suffix              = module.naming_convention.suffix
  resource_group_name = azurerm_resource_group.dynatrace_rg.name
  location            = local.environment.location

  subnet_id = azurerm_subnet.dynatrace_snet.id

  admin = {
    username = "pagopa",
    password = random_password.admin_password.result
  }

  # custom_data = <<-EOT
  #   #!/bin/bash
  #   wget -O Dynatrace-ActiveGate-Linux.sh "https://<tenant-id>.live.dynatrace.com/installer/activegate/unix/latest"
  #   sudo /bin/bash Dynatrace-ActiveGate-Linux.sh
  # EOT

  tags = local.tags
}

## Open Telemetry Collector
# Ref. https://docs.dynatrace.com/docs/ingest-from/opentelemetry/collector/deployment#docker

# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "otel_log" {
  name                = "${module.naming_convention.prefix}-dynatrace-log-${module.naming_convention.suffix}"
  location            = local.environment.location
  resource_group_name = azurerm_resource_group.dynatrace_rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = local.tags
}

# Container App Environment
resource "azurerm_container_app_environment" "otel_cae" {
  name                       = "${module.naming_convention.prefix}-dynatrace-cae-${module.naming_convention.suffix}"
  location                   = local.environment.location
  resource_group_name        = azurerm_resource_group.dynatrace_rg.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.otel_log.workspace_id

  tags = local.tags
}

# Container App
resource "azurerm_container_app" "otel_ca" {
  name                         = "${module.naming_convention.prefix}-otel-ca-${module.naming_convention.suffix}"
  container_app_environment_id = azurerm_container_app_environment.otel_cae.id
  resource_group_name          = azurerm_resource_group.dynatrace_rg.name
  revision_mode                = "Single"
  ingress {
    external_enabled = false # Internal access only
    target_port      = 4317

    traffic_weight {
      latest_revision = true
      percentage = 100
    }
  }
  template {
    container {
      name   = "otel-collector"
      image  = "ghcr.io/dynatrace/dynatrace-otel-collector/dynatrace-otel-collector:latest"
      cpu    = 0.5
      memory = "1.0Gi"

      env {
        name  = "OTEL_CONFIG"
        value = "/etc/otel/config.yaml"
      }

      env {
        name  = "ENDPOINT"
        value = "to do"
      }

      env {
        name  = "API_TOKEN"
        value = "to do"
      }

      volume_mounts {
        name = "otel-config"
        path = "/etc/otel"
      }
    }

    volume {
      name         = "otel-config"
      storage_name = "config-storage"
      storage_type = "AzureFile"
    }
  }
}

# Storage Account for Config Files
resource "azurerm_storage_account" "otel_sa" {
  name                     = replace("${module.naming_convention.project}-otel-sa-${module.naming_convention.suffix}", "-", "")
  resource_group_name      = azurerm_resource_group.dynatrace_rg.name
  location                 = azurerm_resource_group.dynatrace_rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_share" "otel_sa_share" {
  name                 = "otel-config"
  storage_account_name = azurerm_storage_account.otel_sa.name
  quota                = 5
}

# File Upload for Configuration (Example using Local File)
resource "azurerm_storage_share_file" "otel_sa_share_file" {
  name             = "config.yaml"
  storage_share_id = azurerm_storage_share.otel_sa_share.id
  source           = "templates/config.yaml"
}
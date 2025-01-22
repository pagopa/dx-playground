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
  source = "../_modules/virtual_machine"

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

  tags = local.tags
}

## ActiveGate
# Ref. Linux https://docs.dynatrace.com/docs/ingest-from/dynatrace-activegate/installation/linux/linux-install-an-environment-activegate

module "dynatrace_activegate" {
  source = "../_modules/virtual_machine"

  name                = "activegate"
  prefix              = module.naming_convention.prefix
  suffix              = module.naming_convention.suffix
  resource_group_name = azurerm_resource_group.dynatrace_rg.name
  location            = local.environment.location
  sku                 = "Standard_B1ms"

  subnet_id = azurerm_subnet.dynatrace_snet.id

  admin = {
    username = "pagopa",
    password = random_password.admin_password.result
  }

  tags = local.tags
}

# Monitoring (Log Forwarder)
# Ref. https://docs.dynatrace.com/docs/ingest-from/microsoft-azure-services/azure-integrations/set-up-log-forwarder-azure#prereq

data "azurerm_key_vault_secret" "logs_token" {
  name         = "dynatrace-logs-api-token"
  key_vault_id = data.azurerm_key_vault.common_kv.id
}

data "azurerm_key_vault_secret" "target_url" {
  name         = "dynatrace-target-url"
  key_vault_id = data.azurerm_key_vault.common_kv.id
}

module "event_hub" {
  source = "github.com/pagopa/dx//infra/modules/azure_event_hub?ref=main"

  environment                          = merge(local.environment, { app_name = "pg" })
  resource_group_name                  = azurerm_resource_group.dynatrace_rg.name
  tier                                 = "s"
  private_dns_zone_resource_group_name = data.azurerm_resource_group.net_rg.name

  subnet_pep_id = data.azurerm_subnet.pep_snet.id

  allowed_sources = {
    subnet_ids = []
    ips        = ["0.0.0.0/0"]
  }

  eventhubs = [{
    name                   = "log"
    partitions             = 1
    message_retention_days = 1
    consumers              = []
    keys = [
      {
        name   = "dynatrace-logs"
        listen = true
        send   = true
        manage = true
      }
    ]
  }]

  tags = local.tags
}

data "azurerm_eventhub_authorization_rule" "auth" {
  name                = "dynatrace-logs"
  namespace_name      = module.event_hub.name
  eventhub_name       = "${module.naming_convention.prefix}-log-${module.naming_convention.suffix}"
  resource_group_name = azurerm_resource_group.dynatrace_rg.name

  depends_on = [module.event_hub]
}


resource "azurerm_eventhub_namespace_authorization_rule" "ns_auth" {
  name                = "dynatrace-logs"
  namespace_name      = module.event_hub.name
  resource_group_name = azurerm_resource_group.dynatrace_rg.name

  listen = true
  send   = true
  manage = true
}

resource "azurerm_monitor_diagnostic_setting" "logs" {
  for_each = local.targets

  name                           = "${each.key}-diagnostic-settings"
  target_resource_id             = each.value
  eventhub_name                  = "${module.naming_convention.prefix}-log-${module.naming_convention.suffix}"
  eventhub_authorization_rule_id = azurerm_eventhub_namespace_authorization_rule.ns_auth.id

  enabled_log {
    category_group = "AllLogs"
  }

  metric {
    category = "AllMetrics"
  }

  depends_on = [module.event_hub]
}

resource "null_resource" "log_forwarder" {
  provisioner "local-exec" {
    command = <<EOT
      DEPLOYMENT_NAME=dynalogs
      TARGET_URL=${data.azurerm_key_vault_secret.target_url.value}
      TARGET_API_TOKEN=${data.azurerm_key_vault_secret.logs_token.value}
      EVENT_HUB_CONNECTION_STRING="${data.azurerm_eventhub_authorization_rule.auth.primary_connection_string}"
      RESOURCE_GROUP=${azurerm_resource_group.dynatrace_rg.name}
      
      ./scripts/dynatrace-azure-logs.sh \
      --deployment-name $DEPLOYMENT_NAME \
      --target-url $TARGET_URL \
      --target-api-token $TARGET_API_TOKEN \
      --resource-group $RESOURCE_GROUP \
      --event-hub-connection-string $EVENT_HUB_CONNECTION_STRING  \
      --require-valid-certificate true
    EOT
  }

  depends_on = [module.event_hub]
}
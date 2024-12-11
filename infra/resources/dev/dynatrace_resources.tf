# Common
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

# OneAgent
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

# ActiveGate
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

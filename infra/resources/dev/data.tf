data "azurerm_resource_group" "test_rg" {
  name = "${module.naming_convention.project}-test-rg-${local.environment.instance_number}"
}

data "azurerm_resource_group" "net_rg" {
  name = "${module.naming_convention.project}-network-rg-${local.environment.instance_number}"
}

data "azurerm_resource_group" "common_rg" {
  name = "${module.naming_convention.project}-common-rg-${local.environment.instance_number}"
}

data "azurerm_virtual_network" "test_vnet" {
  name                = "${module.naming_convention.project}-common-vnet-${local.environment.instance_number}"
  resource_group_name = data.azurerm_resource_group.net_rg.name
}

data "azurerm_subnet" "pep_snet" {
  name                 = "${module.naming_convention.project}-pep-snet-${local.environment.instance_number}"
  virtual_network_name = data.azurerm_virtual_network.test_vnet.name
  resource_group_name  = data.azurerm_virtual_network.test_vnet.resource_group_name
}

data "azurerm_key_vault" "common_kv" {
  name                = "${module.naming_convention.project}-common-kv-${local.environment.instance_number}"
  resource_group_name = data.azurerm_resource_group.common_rg.name
}

data "azurerm_key_vault_secret" "to_do_api_key" {
  key_vault_id = data.azurerm_key_vault.common_kv.id
  name         = "to-do-api-key"
}

data "azurerm_key_vault_secret" "apim_api_key" {
  key_vault_id = data.azurerm_key_vault.common_kv.id
  name         = "playground-apim-test-key"
}

data "azurerm_key_vault_secret" "dynatrace_cluster_id" {
  key_vault_id = data.azurerm_key_vault.common_kv.id
  name         = "dynatrace-cluster-id"
}

data "azurerm_key_vault_secret" "dynatrace_connection_auth_token" {
  key_vault_id = data.azurerm_key_vault.common_kv.id
  name         = "dynatrace-connection-auth-token"
}

data "azurerm_key_vault_secret" "dynatrace_target_url" {
  key_vault_id = data.azurerm_key_vault.common_kv.id
  name         = "dynatrace-target-url"
}

data "azurerm_key_vault_secret" "dynatrace_tenant" {
  key_vault_id = data.azurerm_key_vault.common_kv.id
  name         = "dynatrace-tenant"
}

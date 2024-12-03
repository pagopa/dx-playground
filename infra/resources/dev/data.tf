data "azurerm_resource_group" "test_rg" {
  name = "${module.naming_convention.project}-test-rg-${local.environment.instance_number}"
}

data "azurerm_resource_group" "net_rg" {
  name = "${module.naming_convention.project}-network-rg-${local.environment.instance_number}"
}

data "azurerm_virtual_network" "test_vnet" {
  name                = "${module.naming_convention.project}-common-vnet-${local.environment.instance_number}"
  resource_group_name = data.azurerm_resource_group.net_rg.name
}

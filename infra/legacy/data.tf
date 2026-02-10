
data "azurerm_subnet" "pep_snet" {
  name                 = "dx-d-itn-pep-snet-01"
  virtual_network_name = "dx-d-itn-common-vnet-01"
  resource_group_name  = "dx-d-itn-network-rg-01"
}

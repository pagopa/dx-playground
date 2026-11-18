# Preserve the allocated CIDR as well as the subnet; otherwise the allocator
# would choose a different, currently unused range on upgrade.
moved {
  from = dx_available_subnet_cidr.apim
  to   = module.apim.dx_available_subnet_cidr.apim
}

moved {
  from = azurerm_subnet.apim
  to   = module.apim.azurerm_subnet.apim
}

moved {
  from = module.apim.azurerm_private_dns_a_record.apim_azure_api_net[0]
  to   = module.apim.azurerm_private_dns_a_record.apim_azure_api_net
}

moved {
  from = module.apim.azurerm_private_dns_a_record.apim_management_azure_api_net[0]
  to   = module.apim.azurerm_private_dns_a_record.apim_management_azure_api_net
}

moved {
  from = module.apim.azurerm_private_dns_a_record.apim_scm_azure_api_net[0]
  to   = module.apim.azurerm_private_dns_a_record.apim_scm_azure_api_net
}

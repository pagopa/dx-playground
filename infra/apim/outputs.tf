output "resource_group_name" {
  description = "Isolated compatibility-test resource group."
  value       = azurerm_resource_group.test.name
}

output "virtual_network_id" {
  description = "Isolated compatibility-test virtual network."
  value       = azurerm_virtual_network.test.id
}

output "apim_id" {
  description = "API Management instance under test."
  value       = module.apim.id
}

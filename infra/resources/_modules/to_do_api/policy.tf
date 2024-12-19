resource "azurerm_api_management_api_policy" "to_do_api" {
  api_name            = azurerm_api_management_api.to_do_api.name
  api_management_name = azurerm_api_management_api.to_do_api.api_management_name
  resource_group_name = azurerm_api_management_api.to_do_api.resource_group_name

  xml_content = templatefile("${path.module}/policy/policy.xml", {
    backend-id = azurerm_api_management_backend.to_do_api_be.name
  })
}

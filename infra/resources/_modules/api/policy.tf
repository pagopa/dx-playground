resource "azurerm_api_management_api_policy" "policy" {
  api_name            = azurerm_api_management_api.api.name
  api_management_name = azurerm_api_management_api.api.api_management_name
  resource_group_name = azurerm_api_management_api.api.resource_group_name

  xml_content = templatefile("${path.module}/policy/policy.xml", {
    backend-id        = azurerm_api_management_backend.backend.name
    base-path         = "api"
    function-key-name = var.api.function_key_named_value_name
  })
}

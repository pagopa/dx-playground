resource "azurerm_api_management_api_policy" "policy" {
  api_name            = azurerm_api_management_api.api.name
  api_management_name = azurerm_api_management_api.api.api_management_name
  resource_group_name = azurerm_api_management_api.api.resource_group_name

  xml_content = templatefile("${path.module}/policy/policy.xml", {
    backend-id   = azurerm_api_management_backend.backend.name
    entra-id-app = var.entra_id_app_client_id
  })
}

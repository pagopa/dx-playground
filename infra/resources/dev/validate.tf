resource "azurerm_resource_group" "no_permissions" {
  name     = "dx-d-itn-playground-permissions-rg-01"
  location = "Italy North"
}

resource "azurerm_role_assignment" "no_permissions" {
  scope                = azurerm_resource_group.no_permissions.id
  role_definition_name = "Reader"
  principal_id         = data.azuread_service_principal.apim.client_id
}

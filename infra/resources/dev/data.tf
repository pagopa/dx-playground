data "azurerm_resource_group" "net_rg" {
  name = "${module.naming_convention.project}-network-rg-${local.environment.instance_number}"
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

# Entra ID application used as identity provider for Function App authentication.
# Callers (e.g. APIM) use their Managed Identity to obtain a JWT from this app.
data "azuread_application" "entra_auth_app" {
  display_name = "playground-test-apim-auth"
}

data "azuread_service_principal" "apim" {
  display_name = module.apim.name
}

data "azurerm_key_vault_secret" "test" {
  name         = "application-insights-connection-string"
  key_vault_id = "/subscriptions/35e6e3b2-4388-470e-a1b9-ad3bc34326d1/resourceGroups/dx-d-itn-playground-rg-01/providers/Microsoft.KeyVault/vaults/dx-d-itn-plygrnd-kv-01"
}

resource "null_resource" "random" {
  provisioner "local-exec" {
    command = "az keyvault secret show --id ${data.azurerm_key_vault_secret.test.id} --query value -o tsv"
  }
}

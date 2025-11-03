data "azurerm_user_assigned_identity" "app_cd" {
  name                = "dx-d-itn-playground-app-github-cd-id-01"
  resource_group_name = "dx-d-itn-playground-rg-01"
}

data "azurerm_user_assigned_identity" "infra_cd" {
  name                = "dx-d-itn-playground-infra-github-cd-id-01"
  resource_group_name = "dx-d-itn-playground-rg-01"
}

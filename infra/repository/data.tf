data "azurerm_user_assigned_identity" "identity_dev_ci" {
  name                = "${local.project}-typescript-github-ci-identity"
  resource_group_name = local.identity_resource_group_name
}

data "azurerm_user_assigned_identity" "identity_dev_cd" {
  name                = "${local.project}-typescript-github-cd-identity"
  resource_group_name = local.identity_resource_group_name
}

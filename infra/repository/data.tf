data "azurerm_user_assigned_identity" "identity_dev_ci" {
  name                = "${local.project}-${local.location_short}-playground-infra-github-ci-id-01"
  resource_group_name = local.identity_resource_group_name
}

data "azurerm_user_assigned_identity" "identity_dev_cd" {
  name                = "${local.project}-${local.location_short}-playground-infra-github-cd-id-01"
  resource_group_name = local.identity_resource_group_name
}

data "azurerm_user_assigned_identity" "identity_app_cd" {
  name                = "${local.project}-${local.location_short}-playground-app-github-cd-id-01"
  resource_group_name = local.identity_resource_group_name
}

data "github_organization_teams" "all" {
  root_teams_only = true
  summary_only    = true
}

data "azurerm_key_vault" "common" {
  name                = "${local.project}-${local.location_short}-common-kv-${local.suffix}"
  resource_group_name = "${local.project}-${local.location_short}-common-rg-${local.suffix}"
}

data "azurerm_key_vault_secret" "github_bot_pat" {
  name         = "dx-pagopa-bot-pat"
  key_vault_id = data.azurerm_key_vault.common.id
}

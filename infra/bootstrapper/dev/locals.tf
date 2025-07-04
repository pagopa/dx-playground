locals {
  environment = {
    prefix          = "dx"
    location        = "italynorth"
    location_short  = "itn"
    env_short       = "d"
    domain          = "playground"
    app_name        = "playground"
    instance_number = "01"
  }

  tags = {
    CostCenter     = "TS000 - Tecnologia e Servizi"
    CreatedBy      = "Terraform"
    Owner          = "DevEx"
    Environment    = "Dev"
    Source         = "https://github.com/pagopa/dx-playground/blob/main/infra/bootstrapper/dev"
    ManagementTeam = "Developer Experience"
  }

  core_state = {
    resource_group_name  = "dx-d-itn-tfstate-rg-01"
    storage_account_name = "dxditntfstatest01"
    container_name       = "terraform-state"
    key                  = "dx.core.dev.tfstate"
  }

  location_short = {
    italynorth = "itn"
    westeurope = "weu"
  }[lower(local.environment.location)]

  project = "${local.environment.prefix}-${local.environment.env_short}-${local.location_short}"

  adgroups = {
    admins_name   = "${local.environment.prefix}-${local.environment.env_short}-adgroup-admin"
    devs_name     = "${local.environment.prefix}-${local.environment.env_short}-adgroup-developers"
    external_name = "${local.environment.prefix}-${local.environment.env_short}-adgroup-externals"
  }

  tf_storage_account = {
    name                = replace("${local.project}tfstatest01", "-", "")
    resource_group_name = "${local.project}-tfstate-rg-01"
  }

  repository = {
    name            = "dx-playground"
    configure       = true
    description     = "A playground for the DevEx team"
    topics          = ["dx", "typescript"]
    reviewers_teams = ["engineering-team-devex"]
  }
}

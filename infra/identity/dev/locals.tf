locals {
  prefix         = "dx"
  env_short      = "d"
  env            = "dev"
  location       = "italynorth"
  location_short = "itn"
  project        = "${local.prefix}-${local.env_short}"
  domain         = "playground"

  repo_name = "dx-playground"

  tags = {
    CostCenter     = "TS000 - Tecnologia e Servizi"
    CreatedBy      = "Terraform"
    Environment    = "Dev"
    BusinessUnit   = "DevEx"
    Source         = "https://github.com/pagopa/dx-playground/tree/main/infra/identity"
    ManagementTeam = "Developer Experience"
  }
}

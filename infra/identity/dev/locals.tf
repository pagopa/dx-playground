locals {
  prefix          = "dx"
  env_short       = "d"
  location        = "italynorth"
  location_short  = "itn"
  domain          = "playground"
  project         = "${local.prefix}-${local.env_short}-${local.location_short}-${local.domain}"
  instance_number = "01"

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

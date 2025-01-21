locals {
  environment = {
    prefix          = "dx"
    env_short       = "d"
    location        = "italynorth"
    domain          = "playground"
    instance_number = "01"
  }

  tags = {
    CostCenter     = "TS700 - ENGINEERING"
    CreatedBy      = "Terraform"
    Environment    = "Dev"
    BusinessUnit   = "DevEx"
    Source         = "https://github.com/pagopa/dx-playground"
    ManagementTeam = "Developer Experience"
    Scope          = "Dynatrace PoC"
  }
}

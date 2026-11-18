locals {
  subscription_id = "35e6e3b2-4388-470e-a1b9-ad3bc34326d1"

  environment = {
    prefix          = "dx"
    env_short       = "d"
    location        = "italynorth"
    domain          = "apim1923"
    app_name        = "compat"
    instance_number = "01"
  }

  tags = {
    CostCenter     = "TS720 - DEV EX"
    Environment    = "Dev"
    Owner          = "DevEx"
    CreatedBy      = "Terraform"
    Source         = "https://github.com/pagopa/dx-playground/blob/main/infra/apim"
    ManagementTeam = "Developer Experience"
    Scope          = "APIM PR 1923 compatibility test"
  }
}

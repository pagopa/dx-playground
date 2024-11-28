locals {
  prefix    = "dx"
  env_short = "d"
  repo_name = "dx-playground"
  location  = "italynorth"
  domain    = "playground"

  environment = {
    prefix          = local.prefix
    env_short       = local.env_short
    location        = local.location
    domain          = local.domain
    app_name        = local.repo_name
    instance_number = "01"
  }

  tags = {
    CostCenter  = "TS310 - PAGAMENTI & SERVIZI"
    CreatedBy   = "Terraform"
    Environment = "Dev"
    Owner       = "DevEx"
  }
}

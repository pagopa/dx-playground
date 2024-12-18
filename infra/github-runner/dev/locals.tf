locals {
  prefix         = "dx"
  suffix         = "01"
  env_short      = "d"
  location       = "italynorth"
  location_short = "itn"
  repo_name      = "dx-playground"
  project        = "${local.prefix}-${local.env_short}"

  tags = {
    CostCenter  = "TS700 - ENGINEERING"
    CreatedBy   = "Terraform"
    Environment = "Dev"
    Owner       = "DevEx"
    Source      = "https://github.com/pagopa/dx-playground/blob/main/infra/github-runner/dev"
  }
}

locals {
  prefix    = "dx"
  env_short = "d"
  env       = "dev"
  location  = "italynorth"
  project   = "${local.prefix}-${local.env_short}"
  domain    = "typescript"

  repo_name = "dx-playground"

  tags = {
    CostCenter  = "TS310 - PAGAMENTI & SERVIZI"
    CreatedBy   = "Terraform"
    Environment = "Dev"
    Owner       = "DevEx"
  }
}

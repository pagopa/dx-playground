locals {
  prefix    = "dx"
  env_short = "d"
  repo_name = "dx-playground"

  tags = {
    CostCenter  = "TS310 - PAGAMENTI & SERVIZI"
    CreatedBy   = "Terraform"
    Environment = "Dev"
    Owner       = "DevEx"
  }
}

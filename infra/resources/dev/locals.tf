locals {
  environment = {
    prefix          = "dx"
    env_short       = "d"
    location        = "italynorth"
    domain          = "playground"
    instance_number = "01"
  }

  tags = {
    CostCenter  = "TS700 - ENGINEERING"
    CreatedBy   = "Terraform"
    Environment = "Dev"
    Owner       = "DevEx"
    Scope       = "Dynatrace PoC"
  }
}

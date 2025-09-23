locals {
  location        = "italynorth"
  project         = "dx-d-itn-vars"
  instance_number = "01"

  me = "58e3c6d6-c60a-4147-ac68-5636f50012c3"

  tags = {
    CostCenter     = "TS000 - Tecnologia e Servizi"
    CreatedBy      = "Terraform"
    Environment    = "Dev"
    BusinessUnit   = "DevEx"
    Source         = "https://github.com/pagopa/dx-playground/tree/main/infra/repository"
    ManagementTeam = "Developer Experience"
    Scope          = "Environment Variables PoC"
  }
}

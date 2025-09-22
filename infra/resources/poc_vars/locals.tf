locals {
  location        = "italynorth"
  project         = "dx-d-itn-vars"
  instance_number = "01"

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

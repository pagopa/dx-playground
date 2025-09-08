locals {
  environment = {
    prefix          = "dx"
    env_short       = "d"
    location        = "italynorth"
    domain          = "test-play"
    instance_number = "01"
  }

  tags = {
    CostCenter     = "TS000 - Tecnologia e Servizi"
    CreatedBy      = "Terraform"
    Environment    = "Dev"
    BusinessUnit   = "DevEx"
    Source         = "https://github.com/pagopa/dx-playground/tree/main/infra/repository"
    ManagementTeam = "Developer Experience"
    Scope          = "Terraform Plan Test"
  }


  # Update with the resources you want to monitor with Dynatrace
  targets = {
    app-service    = module.app_service.app_service.app_service.id
    function-app   = module.function_app.function_app.function_app.id
  }

}

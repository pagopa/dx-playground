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


  # Update with the resources you want to monitor with Dynatrace
  targets = {
    cosmos-account = module.cosmos.id
    app-service    = module.app_service.app_service.app_service.id
    function-app   = module.function_app.function_app.function_app.id
    apim           = module.apim.id
  }

}

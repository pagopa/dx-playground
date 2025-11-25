locals {
  environment = {
    prefix          = "dx"
    env_short       = "d"
    location        = "italynorth"
    domain          = "playground"
    instance_number = "01"
  }

  tags = {
    CostCenter     = "TS000 - Tecnologia e Servizi"
    CreatedBy      = "Terraform"
    Environment    = "Dev"
    BusinessUnit   = "DevEx"
    Source         = "https://github.com/pagopa/dx-playground/tree/main/infra/repository"
    ManagementTeam = "Developer Experience"
    Scope          = "DX Playground"
  }

  resource_group_name = provider::dx::resource_name({
    prefix          = local.environment.prefix
    environment     = local.environment.env_short
    location        = local.environment.location
    name            = local.environment.domain
    resource_type   = "resource_group"
    instance_number = tonumber(local.environment.instance_number)
  })

  # Update with the resources you want to monitor with Dynatrace
  targets = {
    cosmos-account = module.cosmos.id
    app-service    = module.app_service.app_service.app_service.id
    function-app   = module.function_app.function_app.function_app.id
    apim           = module.apim.id
  }

}

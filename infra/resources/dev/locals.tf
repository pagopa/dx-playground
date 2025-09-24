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
    Scope          = "Dynatrace PoC"
  }


  # Update with the resources you want to monitor with Dynatrace
  targets = {
    cosmos-account = module.cosmos.id
    app-service    = module.app_service.app_service.app_service.id
    function-app   = module.function_app.function_app.function_app.id
    apim           = module.apim.id
  }

  aws_environment = {
    prefix          = "dx"
    region          = "eu-south-1"
    region_short    = "eus1"
    env_short       = "d"
    domain          = "playground"
    instance_number = "01"
  }

  core_state = {
    resource_group_name  = "dx-d-itn-tfstate-rg-01"
    storage_account_name = "dxditntfstatest01"
    container_name       = "terraform-state"
    key                  = "dx.core.dev.tfstate"
  }

}

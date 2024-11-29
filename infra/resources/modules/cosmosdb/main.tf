module "account" {
  source = "github.com/pagopa/dx//infra/modules/azure_cosmos_account?ref=ab26f57ed34a614fd3fa496c7b521be9ecc88e1b"

  environment = local.environment
  # FIXME: Change with the resource group created by the core module
  resource_group_name = "example-rg"

  # FIXME: Change with the pep created by the core module
  subnet_pep_id = "data.azurerm_subnet.pep.id"

  consistency_policy = {
    consistency_preset = "HighConsistency"
  }

  alerts = {
    enabled = false
  }

  tags = local.tags
}

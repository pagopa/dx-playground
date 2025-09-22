resource "azurerm_log_analytics_workspace" "cae_law" {
  name                = "${var.environment.prefix}-d-itn-cae-law-${var.environment.instance_number}"
  location            = var.environment.location
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = var.tags
}

resource "dx_available_subnet_cidr" "cae_cidr" {
  virtual_network_id = var.virtual_network.id
  prefix_length      = 23
}

module "cae" {
  source  = "pagopa-dx/azure-container-app-environment/azurerm"
  version = "~> 1.0"

  environment         = var.environment
  resource_group_name = var.resource_group_name

  subnet_pep_id   = var.subnet_pep_id
  virtual_network = var.virtual_network
  subnet_cidr     = dx_available_subnet_cidr.cae_cidr.cidr_block

  log_analytics_workspace_id = azurerm_log_analytics_workspace.cae_law.id

  tags = var.tags
}

locals {
  func_name = "dx-d-itn-playground-poc-cfunc-02"
}

resource "azapi_resource" "fca" {
  type      = "Microsoft.Web/sites@2024-11-01"
  name      = local.func_name
  parent_id = "/subscriptions/35e6e3b2-4388-470e-a1b9-ad3bc34326d1/resourceGroups/dx-d-itn-poc-caef-rg-01"
  location  = "italynorth"

  identity {
    type = "SystemAssigned"
  }

  body = {
    properties = {
      managedEnvironmentId = module.cae.id
      # storageAccountRequired = true
      workloadProfileName = "Consumption"
      httpsOnly           = true
      siteConfig = {
        appSettings = [
          {
            "name" : "FUNCTIONS_EXTENSION_VERSION",
            "value" : "~4"
          },
          {
            "name" : "Custom_value",
            "value" : "random"
          },
          {
            "name" : "AzureWebJobsStorage__credential",
            "value" : "managedidentity"
          },
          {
            "name" : "AzureWebJobsStorage__blobServiceUri",
            "value" : "${trim(azurerm_storage_account.fca_st.primary_blob_endpoint, "/")}"
          },
          {
            "name" : "AzureWebJobsStorage__queueServiceUri",
            "value" : "${trim(azurerm_storage_account.fca_st.primary_queue_endpoint, "/")}"
          },
          {
            "name" : "AzureWebJobsStorage__tableServiceUri",
            "value" : "${trim(azurerm_storage_account.fca_st.primary_table_endpoint, "/")}"
          }
        ]
        use32BitWorkerProcess       = false
        ftpsState                   = "FtpsOnly"
        linuxFxVersion              = "DOCKER|mcr.microsoft.com/azure-functions/dotnet8-quickstart-demo:1.0"
        functionAppScaleLimit       = 11
        minimumElasticInstanceCount = 2

      }
      clientAffinityEnabled  = false
      virtualNetworkSubnetId = null
    }
    kind = "functionapp,linux,container,azurecontainerapps"
  }

  tags = var.tags
}

resource "azurerm_storage_account" "fca_st" {
  name                     = "dxditnplaypoccfuncst02"
  resource_group_name      = var.resource_group_name
  location                 = "italynorth"
  account_tier             = "Standard"
  access_tier              = "Hot"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"

  https_traffic_only_enabled      = true
  default_to_oauth_authentication = true

  public_network_access_enabled   = true
  shared_access_key_enabled       = false
  allow_nested_items_to_be_public = false

  tags = var.tags
}

resource "azurerm_role_assignment" "fca_st_role" {
  scope                = azurerm_storage_account.fca_st.id
  role_definition_name = "Storage Blob Data Owner"
  principal_id         = azapi_resource.fca.identity[0].principal_id
}

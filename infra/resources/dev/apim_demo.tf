locals {
  func_app_01         = "dx-d-itn-apimdemo-func-01"
  func_app_02         = "dx-d-itn-apimdemo-func-02"
  resource_group_name = "dx-d-itn-test-rg-01"
  key_vault_name      = "dx-d-itn-common-kv-01"
  app_demo_pool       = "app-demo-pool"
}

# Function Apps
data "azurerm_linux_function_app" "demo01" {
  name                = local.func_app_01
  resource_group_name = local.resource_group_name
}

data "azurerm_linux_function_app" "demo02" {
  name                = local.func_app_02
  resource_group_name = local.resource_group_name
}

data "azurerm_function_app_host_keys" "demo01" {
  name                = local.func_app_01
  resource_group_name = local.resource_group_name
}

data "azurerm_function_app_host_keys" "demo02" {
  name                = local.func_app_02
  resource_group_name = local.resource_group_name
}

# KeyVault
data "azurerm_key_vault" "common" {
  name                = local.key_vault_name
  resource_group_name = "dx-d-itn-common-rg-01"
}

resource "azurerm_key_vault_secret" "demo01_key" {
  name         = "dx-d-itn-apimdemo-func-01-key"
  value        = data.azurerm_function_app_host_keys.demo01.default_function_key
  key_vault_id = data.azurerm_key_vault.common.id
}

resource "azurerm_key_vault_secret" "demo02_key" {
  name         = "dx-d-itn-apimdemo-func-02-key"
  value        = data.azurerm_function_app_host_keys.demo02.default_function_key
  key_vault_id = data.azurerm_key_vault.common.id
}

# APIM Named Values
resource "azurerm_api_management_named_value" "demo01_key" {
  name         = "dx-d-itn-apimdemo-func-01-key"
  display_name = "dx-d-itn-apimdemo-func-01-key"

  secret = true
  value_from_key_vault {
    secret_id = azurerm_key_vault_secret.demo01_key.versionless_id
  }
  resource_group_name = module.apim.resource_group_name
  api_management_name = module.apim.name

  tags = [
    "function",
    "key",
  ]
}

resource "azurerm_api_management_named_value" "demo02_key" {
  name         = "dx-d-itn-apimdemo-func-02-key"
  display_name = "dx-d-itn-apimdemo-func-02-key"

  secret = true
  value_from_key_vault {
    secret_id = azurerm_key_vault_secret.demo02_key.versionless_id
  }
  resource_group_name = module.apim.resource_group_name
  api_management_name = module.apim.name

  tags = [
    "function",
    "key",
  ]
}

# Product

resource "azurerm_api_management_product" "devportal" {
  product_id            = "devportal"
  api_management_name   = module.apim.name
  resource_group_name   = module.apim.resource_group_name
  display_name          = "DevPortal"
  subscription_required = true
  approval_required     = false
  published             = true
}

# Demo API

# V1 - Invoke Demo 01
resource "azurerm_api_management_api_version_set" "demo_app" {
  name                = "demo-app-version"
  api_management_name = module.apim.name
  resource_group_name = module.apim.resource_group_name
  description         = "Version set for Demo App APIs"
  display_name        = "Demo App APIs"
  versioning_scheme   = "Segment"
}

resource "azurerm_api_management_api" "demo_v1_rev1" {
  name                  = "function-demo"
  display_name          = "Demo Function App"
  api_management_name   = module.apim.name
  resource_group_name   = module.apim.resource_group_name
  protocols             = ["https"]
  path                  = "fnapp"
  revision              = "1"
  revision_description  = "Invoke Demo App 01 via Named Value"
  version               = "v1"
  version_set_id        = azurerm_api_management_api_version_set.demo_app.id
  version_description   = "Invoke Demo App 01"
  service_url           = "https://${data.azurerm_linux_function_app.demo01.default_hostname}/api"
  subscription_required = true

  import {
    content_format = "openapi+json-link"
    content_value  = "https://dxditnapimdemooast01.blob.core.windows.net/open-api/dx-d-itn-apimdemo-func-01.openapi+json.json"
  }
}

resource "azurerm_api_management_api_policy" "demo_v1_rev1" {
  api_name            = azurerm_api_management_api.demo_v1_rev1.name
  api_management_name = module.apim.name
  resource_group_name = module.apim.resource_group_name

  xml_content = <<XML
  <policies>
    <inbound>
        <base />
        <set-header name="x-functions-key">
          <value>{{${azurerm_api_management_named_value.demo01_key.name}}}</value>
        </set-header>
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
  </policies>
  XML
}

resource "azurerm_api_management_tag" "demo" {
  api_management_id = module.apim.id
  name              = "demo-app"
}

resource "azurerm_api_management_api_tag" "demo" {
  api_id = azurerm_api_management_api.demo_v1_rev1.id
  name   = azurerm_api_management_tag.demo.name
}

resource "azurerm_api_management_product_api" "demo_v1_rev1" {
  api_name            = azurerm_api_management_api.demo_v1_rev1.name
  product_id          = azurerm_api_management_product.devportal.product_id
  api_management_name = module.apim.name
  resource_group_name = module.apim.resource_group_name
}

# Rev2 - Introducing the Backend Demo 01
# APIM Backend
resource "azurerm_api_management_backend" "demo_01" {
  name                = "demo-function-app-01"
  description         = "Invoke dx-d-itn-apimdemo-func-01 FunctionApp"
  api_management_name = module.apim.name
  resource_group_name = module.apim.resource_group_name
  protocol            = "http"
  url                 = "https://${data.azurerm_linux_function_app.demo01.default_hostname}/api"
  resource_id         = "https://management.azure.com${data.azurerm_linux_function_app.demo01.id}"
  title               = "Demo Function App 01"

  credentials {
    header = {
      "x-functions-key" = "{{${azurerm_api_management_named_value.demo01_key.name}}}"
    }
  }
}

# -- do not work via terraform --
resource "azurerm_api_management_api" "demo_v1_rev2" {
  name                  = "function-demo"
  display_name          = "Demo Function App"
  api_management_name   = module.apim.name
  resource_group_name   = module.apim.resource_group_name
  protocols             = ["https"]
  path                  = "fnapp"
  revision              = "2"
  revision_description  = "Invoke Demo App 01 via Backend"
  version               = "v1"
  version_set_id        = azurerm_api_management_api_version_set.demo_app.id
  version_description   = "Invoke Demo App 01"
  service_url           = "https://${data.azurerm_linux_function_app.demo02.default_hostname}/api"
  subscription_required = true

  import {
    content_format = "openapi+json-link"
    content_value  = "https://dxditnapimdemooast01.blob.core.windows.net/open-api/dx-d-itn-apimdemo-func-02.openapi+json.json"
  }
}

resource "azurerm_api_management_product_api" "demo_v1_rev2" {
  api_name            = azurerm_api_management_api.demo_v1_rev2.name
  product_id          = azurerm_api_management_product.devportal.product_id
  api_management_name = module.apim.name
  resource_group_name = module.apim.resource_group_name
}

resource "azurerm_api_management_api_policy" "demo_v1_rev2" {
  api_name            = azurerm_api_management_api.demo_v1_rev2.name
  api_management_name = module.apim.name
  resource_group_name = module.apim.resource_group_name

  xml_content = <<XML
  <policies>
    <inbound>
        <base />
        <set-backend-service id="apim-generated-policy" backend-id="${azurerm_api_management_backend.demo_01.name}" />
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
  </policies>
  XML
}

# V2 - Invoke Demo App 01 and Demo App 02 (Pool)

resource "azurerm_api_management_backend" "demo_02" {
  name                = "demo-function-app-02"
  description         = "Invoke dx-d-itn-apimdemo-func-02 FunctionApp"
  api_management_name = module.apim.name
  resource_group_name = module.apim.resource_group_name
  protocol            = "http"
  url                 = "https://${data.azurerm_linux_function_app.demo02.default_hostname}/api"
  resource_id         = "https://management.azure.com${data.azurerm_linux_function_app.demo02.id}"
  title               = "Demo Function App 02"

  credentials {
    header = {
      "x-functions-key" = "{{${azurerm_api_management_named_value.demo02_key.name}}}"
    }
  }
}

resource "azurerm_api_management_api" "demo_v2_rev1" {
  name                 = "function-demo-v2"
  display_name         = "Demo Function App"
  api_management_name  = module.apim.name
  resource_group_name  = module.apim.resource_group_name
  protocols            = ["https"]
  path                 = "fnapp"
  revision             = "1"
  revision_description = "Invoke Demo App 01 and 02"
  version              = "v2"
  version_set_id       = azurerm_api_management_api_version_set.demo_app.id
  version_description  = "Invoke Demo App 01 and 02"
  # service_url           = "https://${data.azurerm_linux_function_app.demo02.default_hostname}/api"
  subscription_required = true

  import {
    content_format = "openapi+json-link"
    content_value  = "https://dxditnapimdemooast01.blob.core.windows.net/open-api/dx-d-itn-apimdemo-func-02.openapi+json.json"
  }
}

resource "azurerm_api_management_product_api" "demo_v2_rev1" {
  api_name            = azurerm_api_management_api.demo_v2_rev1.name
  product_id          = azurerm_api_management_product.devportal.product_id
  api_management_name = module.apim.name
  resource_group_name = module.apim.resource_group_name
}

resource "azapi_resource" "demo_apps_pool" {
  type      = "Microsoft.ApiManagement/service/backends@2024-06-01-preview"
  name      = local.app_demo_pool
  parent_id = module.apim.id
  body = {
    properties = {
      protocol    = null
      url         = null
      type        = "Pool"
      description = "Load Balancer of Demo Apps"
      pool = {
        services = [
          {
            id = azurerm_api_management_backend.demo_01.id
          },
          {
            id = azurerm_api_management_backend.demo_02.id
          }
        ]
      }
    }
  }
}

resource "azurerm_api_management_api_policy" "demo_v2_rev1" {
  api_name            = azurerm_api_management_api.demo_v2_rev1.name
  api_management_name = module.apim.name
  resource_group_name = module.apim.resource_group_name

  xml_content = <<XML
  <policies>
    <inbound>
        <base />
        <set-backend-service id="apim-generated-policy" backend-id="${local.app_demo_pool}" />
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
  </policies>
  XML
}

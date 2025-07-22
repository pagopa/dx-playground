extension radius

// @description('The Radius Application ID. Injected automatically by the rad CLI.')
// param application string // Assicurati che questa riga sia presente

@description('ARM_CLIENT_SECRET')
@secure()
param client_secret string
param subscription_id string
param tenant_id string
param client_id string


resource tfSecretStore 'Applications.Core/secretStores@2023-10-01-preview' = {
  name: 'my-secret-store'
  properties: {
    resource: 'my-secret-namespace/my-secret-store'
    type: 'generic'
    data: {
      subscription_id: {
        value: subscription_id
      }
      tenant_id: {
        value: tenant_id
      }
      client_id: {
        value: client_id
      }
      client_secret: {
        value: client_secret
      }
    }
  }
}


resource env 'Applications.Core/environments@2023-10-01-preview' = {
  name: 'tf-demo'
  properties: {
    compute: {
      kind: 'kubernetes'
      resourceId: 'self'
      namespace: 'terraform-demo'
    }
    providers: {
      azure: {
        scope: '/subscriptions/d7de83e0-0571-40ad-b63a-64c942385eae/resourceGroups/dx-d-itn-test-rg-01'
      }
    }
    recipeConfig: {
      terraform: {
        providers: {
          azurerm: []
          dx: []
        }
      }
      envSecrets: {
        ARM_SUBSCRIPTION_ID: {
          source: tfSecretStore.id
          key: 'subscription_id'
        }
        ARM_TENANT_ID: {
          source: tfSecretStore.id
          key: 'tenant_id'
        }
        ARM_CLIENT_ID: {
          source: tfSecretStore.id
          key: 'client_id'
        }
        ARM_CLIENT_SECRET: {
          source: tfSecretStore.id
          key: 'client_secret'
        }
      }
    }
    recipes: {
      'Applications.Core/extenders': {
        terraformStorage: {
          templateKind: 'terraform'
          templatePath: 'git::https://github.com/pagopa/dx-playground.git//infra/radius-demo/recipes/test?ref=demo-radius'
        }
        terraformStorage2: {
          templateKind: 'terraform'
          templatePath: 'git::https://github.com/pagopa/dx-playground.git//infra/radius-demo/recipes/test2?ref=demo-radius'
        }
      }
    }
  }
}

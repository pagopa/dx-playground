extension radius

@description('The ID of your Radius environment. Automatically injected by the rad CLI.')
param environment string

@description('The Radius Application ID. Injected automatically by the rad CLI.')
param application string

resource storageExtender 'Applications.Core/extenders@2023-10-01-preview' = {
  name: 'storageresource'
  properties: {
    application: application
    environment: environment
    recipe: {
      name: 'terraformStorage'
      // Possible terraform parameters
      parameters: {
        resource_group_name: 'dx-d-itn-test-rg-01'
      }
    }
  }
}

resource storage2Extender 'Applications.Core/extenders@2023-10-01-preview' = {
  name: 'storageresource'
  properties: {
    application: application
    environment: environment
    recipe: {
      name: 'terraformStorage'
      // Possible terraform parameters
      parameters: {
        resource_group_name: 'dx-d-itn-test-rg-01'
      }
    }
    connections: {
      redis: {
        source: storageExtender.id
      }
    }
  }
}

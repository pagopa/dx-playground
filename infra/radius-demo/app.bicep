extension radius

@description('The ID of your Radius environment. Automatically injected by the rad CLI.')
param environment string

@description('The Radius Application ID. Injected automatically by the rad CLI.')
param application string

resource myDemoApp 'Applications.Core/containers@2023-10-01-preview' = {
  name: 'my-demo-app'
  properties: {
    application: application
    environment: environment
    container: {
      image: 'nginx' // Example image
      ports: {
        web: {
          containerPort: 80
        }
      }
    }

    connections: {
      primaryStorage: {
        source: storageExtender.id
      }
    }
  }
}


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
  name: 'storageresource2'
  properties: {
    application: application
    environment: environment
    recipe: {
      name: 'terraformStorage2'
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

```mermaid
graph LR
  subgraph API Management
    ApiManagementApiPolicy["API Management API Policy"]
    ApiManagementApi["API Management API"]
    ApiManagementBackend["API Management Backend"]
  end

  ApiManagementApiPolicy --> ApiManagementApi
  ApiManagementApiPolicy --> ApiManagementBackend
```

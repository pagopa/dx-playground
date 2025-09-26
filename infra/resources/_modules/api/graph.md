```mermaid
graph LR
  subgraph API Management
    ApiManagementApi["API Management API"]
    ApiManagementApiPolicy["API Management API Policy"]
    ApiManagementBackend["API Management Backend"]
  end

  ApiManagementApiPolicy --> ApiManagementApi
  ApiManagementApiPolicy --> ApiManagementBackend
```

```mermaid
graph LR
  subgraph API Management
    ApimApi["API Management API"]
    ApimApiPolicy["API Management API Policy"]
    ApimBackend["API Management Backend"]
  end

  ApimApiPolicy --> ApimApi
  ApimApiPolicy --> ApimBackend
```

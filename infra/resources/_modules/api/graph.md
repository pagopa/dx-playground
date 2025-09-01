```mermaid
graph LR
subgraph API Management Service
  API["API Management API"]
  Policy["API Management API Policy"]
  Backend["API Management Backend"]
end

Policy --> API
Policy --> Backend
```

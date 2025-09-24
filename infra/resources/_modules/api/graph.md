```mermaid
graph LR
  subgraph API Management
    Api["API Management API"]
    Backend["API Management Backend"]
    ApiPolicy["API Management API Policy"]
  end

  ApiPolicy --> Api
  ApiPolicy --> Backend
```

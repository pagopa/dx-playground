```mermaid
graph LR
  subgraph API Management
    api["API Management API"]
    policy["API Management Policy"]
    backend["API Management Backend"]
  end

  policy --> api
  policy --> backend
```

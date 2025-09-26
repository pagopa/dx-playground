```mermaid
graph LR
  subgraph Observability
    AInsights["Application Insights"]
    LAWorkspace["Log Analytics Workspace"]
  end
  KVSecret["Key Vault Secret AI Connection String"]
  KVSecret --> AInsights
  AInsights --> LAWorkspace
```

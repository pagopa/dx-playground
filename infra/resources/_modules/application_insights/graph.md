```mermaid
graph LR
  subgraph Key Vault
    KVSecret["Key Vault Secret - AI Connection String"]
  end

  subgraph Monitoring
    AppInsights["Application Insights"]
    LogAnalytics["Log Analytics Workspace"]
  end

  KVSecret --> AppInsights
  AppInsights --> LogAnalytics
```

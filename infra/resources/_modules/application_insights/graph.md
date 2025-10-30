```mermaid
graph LR
  subgraph Monitoring
    AppInsights["Application Insights"]
    LogAnalytics["Log Analytics Workspace"]
  end

  KeyVaultSecret["Key Vault Secret (AI Connection String)"]

  KeyVaultSecret --> AppInsights
  AppInsights --> LogAnalytics
```

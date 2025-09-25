```mermaid
graph LR
  subgraph Monitoring
    ApplicationInsights["Application Insights"]
    LogAnalyticsWorkspace["Log Analytics Workspace"]
  end

  subgraph Key Vault
    KeyVaultSecret["Key Vault Secret - AI Connection String"]
  end

  KeyVaultSecret --> ApplicationInsights
  ApplicationInsights --> LogAnalyticsWorkspace
```

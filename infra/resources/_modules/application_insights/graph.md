```mermaid
graph LR
  subgraph Observability
    ApplicationInsights["Application Insights"]
    LogAnalyticsWorkspace["Log Analytics Workspace"]
  end

  KeyVaultSecretAI["Key Vault Secret - AI Connection String"]

  KeyVaultSecretAI --> ApplicationInsights
  ApplicationInsights --> LogAnalyticsWorkspace
```

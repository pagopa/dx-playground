```mermaid
graph LR

subgraph Key Vault
  keyVaultSecretAIConnectionString["Key Vault Secret - AI Connection String"]
end

subgraph Application Insights
  applicationInsightsMain["Application Insights"]
end

subgraph Log Analytics Workspace
  logAnalyticsWorkspaceMain["Log Analytics Workspace"]
end

keyVaultSecretAIConnectionString --> applicationInsightsMain
applicationInsightsMain --> logAnalyticsWorkspaceMain
```

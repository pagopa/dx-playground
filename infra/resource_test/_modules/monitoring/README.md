# Monitoring Module

This module creates comprehensive Azure monitoring resources including Application Insights, Log Analytics Workspace, and Action Groups for alerting.

## Resources Created

- **Log Analytics Workspace** - For log aggregation and analysis
- **Application Insights** - For application monitoring and diagnostics
- **Monitor Action Group** - For alerting and notifications

## Usage

```hcl
module "monitoring" {
  source = "../_modules/monitoring"

  environment = {
    prefix          = local.environment.prefix
    env_short       = local.environment.env_short
    location        = local.environment.location
    domain          = local.environment.domain
    app_name        = "my-app"
    instance_number = 1
  }

  resource_group_name = azurerm_resource_group.main.name
  tags                = local.tags
}
```

## Outputs

### Application Insights Outputs
- `connection_string` - The connection string to Application Insights (sensitive)
- `ephemeral_connection_string` - Ephemeral connection string (not stored in state, sensitive)
- `application_insights_id` - The ID of the Application Insights instance

### Log Analytics Outputs
- `log_analytics_workspace_id` - The ID of the Log Analytics workspace

### Action Group Outputs
- `action_group_id` - The ID of the Monitor Action Group
- `action_group_name` - The name of the Monitor Action Group

## Ephemeral Outputs

The `ephemeral_connection_string` output is marked as ephemeral, which means:
- The sensitive connection string is **not persisted** in the Terraform state file
- It can only be used within the same Terraform run
- Useful for passing secrets between modules without storing them in state




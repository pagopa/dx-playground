# OpEx Dashboard TypeScript

**Generate standardized PagoPA's Operational Excellence dashboards from OpenAPI
specs using TypeScript and CDKTF.**

## Overview

This is a TypeScript port of the Python
[opex-dashboard](https://github.com/pagopa/opex-dashboard) project. It generates
Azure dashboards and alerts from OpenAPI specifications using CDK for Terraform
(CDKTF), maintaining exact compatibility with the Python version.

## Features

- ** Scheduled Alerts**: Generates Azure Monitor alerts for availability and
  response time
- **📋 OpenAPI Support**: Parses Swagger and OpenAPI 3.x specifications
- **🏗️ CDKTF Integration**: Uses CDK for Terraform for infrastructure as code
- **🔒 Type Safety**: Full TypeScript support with comprehensive type checking
- **⚡ Exact Replication**: Maintains 100% compatibility with Python version
  output

## Quick Start

1. **Create a configuration file** (`config.yaml`):

```yaml
oa3_spec: ./examples/petstore.yaml
name: PetStore Dashboard
resource_group_name: dashboards # the dashboard and alerts will be created in this RG
# Location is inherited from the Resource Group (no need to specify it)
data_source: /subscriptions/xxx/resourceGroups/xxx/providers/Microsoft.Network/applicationGateways/xxx
resource_type: app-gateway
action_groups:
  - /subscriptions/xxx/resourceGroups/xxx/providers/Microsoft.Insights/actionGroups/xxx
tags:
  BusinessUnit: PAGOPA
  Environment: DEV
```

2. **Generate Terraform (CDKTF) code**:

```bash
yarn tsx src/cli/index.ts generate --config-file config.yaml
```

## Configuration

The configuration format is identical to the Python version:

### Basic Configuration

```yaml
# Required fields
oa3_spec: ./path/to/openapi.yaml # Path to OpenAPI spec file
name: My API Dashboard # Dashboard name
resource_group_name: dashboards # Resource Group to host the dashboard and alerts
data_source: /subscriptions/.../applicationGateways/my-gtw # Resource ID used in queries

# Optional fields
resource_type: app-gateway # 'app-gateway' or 'api-management' (default: app-gateway)
timespan: 5m # Dashboard timespan (default: 5m)
action_groups: # Action groups for alerts
  - /subscriptions/.../actionGroups/my-action-group
tags: # Tags applied to dashboard and alerts
  CostCenter: CC123
  Environment: DEV
```

### Advanced Configuration

For each host and endpoint, you can override default settings:

```yaml
# Override defaults
overrides:
  hosts:
    - api.example.com
    - staging.api.example.com
  endpoints:
    /api/users:
      availability_threshold: 0.95
      response_time_threshold: 2.0
    /api/orders:
      enabled: false # Disable monitoring for this endpoint
```

### Configuration Reference

| Field                 | Type                  | Required | Default       | Description                                                                |
| --------------------- | --------------------- | -------- | ------------- | -------------------------------------------------------------------------- |
| `oa3_spec`            | string                | ✅       | -             | Path/URL to OpenAPI specification                                          |
| `name`                | string                | ✅       | -             | Dashboard name                                                             |
| `resource_group_name` | string                | ✅       | `dashboards`  | Resource Group where dashboard and alerts will be created                  |
| `data_source`         | string                | ✅       | -             | Azure resource ID used by KQL queries (e.g., Application Gateway resource) |
| `resource_type`       | string                | ❌       | `app-gateway` | Resource type (`app-gateway` or `api-management`)                          |
| `timespan`            | string                | ❌       | `5m`          | Dashboard timespan                                                         |
| `action_groups`       | string[]              | ❌       | -             | Action groups for alerts                                                   |
| `tags`                | Record<string,string> | ❌       | -             | Tags applied to dashboard and alerts                                       |
| `overrides`           | object                | ❌       | -             | Override default settings for hosts/endpoints                              |

Notes:

- The Azure location is inferred from the specified `resource_group_name` via data source lookup; do not set `location` in config.

## Migration

This project now inherits the Azure location from the specified Resource Group and supports applying tags to both the dashboard and alerts. If you're upgrading from an earlier version where `location` was set explicitly in the configuration, follow the steps below.

### What changed

- Location is no longer read from the configuration file. It is resolved at synth time from the Resource Group via a data source. The `location` key, if present, is ignored.
- A new optional `tags` block can be specified and will be applied to the `azurerm_portal_dashboard` and all `azurerm_monitor_scheduled_query_rules_alert` resources.

### How to update your configuration

1. Ensure `resource_group_name` points to the target Azure Resource Group. The resources will inherit the location of this group.
2. Remove the `location` field from your YAML (it will be ignored if left in place).
3. Optionally add a `tags` map to propagate tags to the dashboard and alerts.

Before (old config):

```yaml
oa3_spec: ./examples/petstore.yaml
name: PetStore Dashboard
location: westeurope
data_source: /subscriptions/xxx/resourceGroups/xxx/providers/Microsoft.Network/applicationGateways/xxx
resource_type: app-gateway
action_groups:
  - /subscriptions/xxx/resourceGroups/xxx/providers/Microsoft.Insights/actionGroups/xxx
```

After (new config):

```yaml
oa3_spec: ./examples/petstore.yaml
name: PetStore Dashboard
resource_group_name: dashboards # location is inherited from this RG
data_source: /subscriptions/xxx/resourceGroups/xxx/providers/Microsoft.Network/applicationGateways/xxx
resource_type: app-gateway
action_groups:
  - /subscriptions/xxx/resourceGroups/xxx/providers/Microsoft.Insights/actionGroups/xxx
tags:
  BusinessUnit: PAGOPA
  Environment: DEV
```

You can omit `resource_group_name` which defaults to `dashboards`.

### Impact on Terraform plans

- If your previous `location` matched the Resource Group's location, you should see no resource recreation due to location. The dashboard and alerts will continue to be deployed in the same region.
- If your previous `location` differed from the Resource Group's location, Terraform may propose to replace resources to align with the RG location. Align the Resource Group or accept the plan as appropriate.
- Adding `tags` will result in in-place updates where supported.

### Programmatic usage (TypeScript)

- The `DashboardConfig` type now treats `location` as optional and it is not used. Set `resource_group_name` to control the deployment location. You may also set the new optional `tags: Record<string, string>` property.

### FAQ

- Can I still specify `location` in my config? Yes, but it is ignored. The only source of truth for location is the Resource Group.
- Do I need to migrate immediately? No. Leaving `location` in your YAML won't break generation, but removing it is recommended to avoid confusion.

## Examples

### Example 1: Basic Dashboard Generation

```bash
# Generate Terraform CDK code
yarn tsx src/cli/index.ts generate \
  --config-file examples/basic-config.yaml
```

## Related Projects

- [opex-dashboard (Python)](https://github.com/pagopa/opex-dashboard) - Original
  Python implementation
- [CDK for Terraform](https://www.terraform.io/cdktf) - CDKTF documentation
- [Azure Monitor](https://docs.microsoft.com/en-us/azure/azure-monitor/) - Azure
  monitoring documentation

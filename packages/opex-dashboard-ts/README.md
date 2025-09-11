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
location: West Europa
data_source: /subscriptions/xxx/resourceGroups/xxx/providers/Microsoft.Network/applicationGateways/xxx
resource_type: app-gateway
action_groups:
  - /subscriptions/xxx/resourceGroups/xxx/providers/Microsoft.Insights/actionGroups/xxx
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
location: West Europe # Azure region
data_source: /subscriptions/.../applicationGateways/my-gtw # Resource ID

# Optional fields
resource_type: app-gateway # 'app-gateway' or 'api-management' (default: app-gateway)
timespan: 5m # Dashboard timespan (default: 5m)
action_groups: # Action groups for alerts
  - /subscriptions/.../actionGroups/my-action-group
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
      availabilityThreshold: 0.95
      responseTimeThreshold: 2.0
    /api/orders:
      enabled: false # Disable monitoring for this endpoint
```

### Configuration Reference

| Field           | Type     | Required | Default       | Description                                       |
| --------------- | -------- | -------- | ------------- | ------------------------------------------------- |
| `oa3_spec`      | string   | ✅       | -             | Path/URL to OpenAPI specification                 |
| `name`          | string   | ✅       | -             | Dashboard name                                    |
| `location`      | string   | ✅       | -             | Azure region                                      |
| `data_source`   | string   | ✅       | -             | Azure resource ID                                 |
| `resource_type` | string   | ❌       | `app-gateway` | Resource type (`app-gateway` or `api-management`) |
| `timespan`      | string   | ❌       | `5m`          | Dashboard timespan                                |
| `action_groups` | string[] | ❌       | -             | Action groups for alerts                          |
| `overrides`     | object   | ❌       | -             | Override default settings                         |

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

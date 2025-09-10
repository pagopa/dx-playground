# OpEx Dashboard TypeScript

**Generate standardized PagoPA's Operational Excellence dashboards from OpenApi specs using TypeScript and CDKTF.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![CDKTF](https://img.shields.io/badge/CDKTF-0.20-green.svg)](https://www.terraform.io/cdktf)
[![Jest](https://img.shields.io/badge/Jest-29-red.svg)](https://jestjs.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

This is a TypeScript port of the Python [opex-dashboard](https://github.com/pagopa/opex-dashboard) project. It generates Azure dashboards and alerts from OpenAPI specifications using CDK for Terraform (CDKTF), maintaining exact compatibility with the Python version.

## Features

- ** Scheduled Alerts**: Generates Azure Monitor alerts for availability and response time
- **📋 OpenAPI Support**: Parses OpenAPI 3.x specifications
- **🏗️ CDKTF Integration**: Uses CDK for Terraform for infrastructure as code
- **🔒 Type Safety**: Full TypeScript support with comprehensive type checking
- **⚡ Exact Replication**: Maintains 100% compatibility with Python version output

## Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd packages/opex-dashboard-ts

# Install dependencies
yarn install

# Build the project
yarn build
```

### Basic Usage

1. **Create a configuration file** (`config.yaml`):
```yaml
oa3_spec: ./examples/petstore.yaml
name: PetStore Dashboard
location: East US
data_source: /subscriptions/xxx/resourceGroups/xxx/providers/Microsoft.Network/applicationGateways/xxx
resource_type: app-gateway
action_groups:
  - /subscriptions/xxx/resourceGroups/xxx/providers/Microsoft.Insights/actionGroups/xxx
```

2. **Generate CDKTF code**:
```bash
yarn ts-node src/cli/index.ts generate \
  --config-file config.yaml
```

## Architecture

### Core Components

1. **OpenAPI Resolver** (`src/core/resolver.ts`)
   - Parses OpenAPI specifications using `@apidevtools/swagger-parser`
   - Handles both local files and remote URLs
   - Provides comprehensive error handling

2. **Kusto Query Templates** (`src/core/kusto-queries.ts`)
   - Generates identical Kusto queries as Python version
   - Supports API Management and Application Gateway resource types
   - Handles regex escaping for endpoint paths

3. **CDKTF Constructs**
   - `AzureDashboardConstruct`: Creates Azure Portal dashboards
   - `AzureAlertsConstruct`: Creates Azure Monitor scheduled query rules

4. **Builders**
   - `AzureDashboardCdkBuilder`: Generates CDKTF code for Terraform

### Key Differences from Python Version

- **🏗️ CDKTF First**: Uses CDKTF constructs instead of Django templates where possible
- **📝 String Templates**: Uses JavaScript template literals for complex JSON structures
- **🔒 Type Safety**: Full TypeScript typing throughout the codebase
- **🚫 No Template Engine**: No Handlebars or Django - pure CDKTF and string templates

## Configuration

The configuration format is identical to the Python version:

### Basic Configuration

```yaml
# Required fields
oa3_spec: ./path/to/openapi.yaml  # Path to OpenAPI spec file
name: My API Dashboard           # Dashboard name
location: West Europe           # Azure region
data_source: /subscriptions/.../applicationGateways/my-gtw  # Resource ID

# Optional fields
resource_type: app-gateway       # 'app-gateway' or 'api-management' (default: app-gateway)
timespan: 5m                    # Dashboard timespan (default: 5m)
action_groups:                  # Action groups for alerts
  - /subscriptions/.../actionGroups/my-action-group
```

### Advanced Configuration

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
      enabled: false  # Disable monitoring for this endpoint
```

### Configuration Reference

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `oa3_spec` | string | ✅ | - | Path/URL to OpenAPI specification |
| `name` | string | ✅ | - | Dashboard name |
| `location` | string | ✅ | - | Azure region |
| `data_source` | string | ✅ | - | Azure resource ID |
| `resource_type` | string | ❌ | `app-gateway` | Resource type (`app-gateway` or `api-management`) |
| `timespan` | string | ❌ | `5m` | Dashboard timespan |
| `action_groups` | string[] | ❌ | - | Action groups for alerts |
| `overrides` | object | ❌ | - | Override default settings |

## API Documentation

### Core Classes

#### `OA3Resolver`

```typescript
class OA3Resolver {
  async resolve(specPath: string): Promise<OpenAPISpec>
}
```

Parses OpenAPI specifications and returns typed objects.

#### `AzureDashboardCdkBuilder`

```typescript
class AzureDashboardCdkBuilder {
  constructor(config: DashboardConfig)
  build(): string
}
```

Creates CDKTF code for Azure dashboards and alerts.

### Utility Functions

#### `parseEndpoints`

```typescript
function parseEndpoints(spec: OpenAPISpec, config: DashboardConfig): Endpoint[]
```

Parses OpenAPI spec and returns endpoint configurations with defaults applied.

#### `buildAvailabilityQuery`

```typescript
function buildAvailabilityQuery(endpoint: Endpoint, config: DashboardConfig): string
```

Generates Kusto query for availability monitoring.

#### `buildResponseTimeQuery`

```typescript
function buildResponseTimeQuery(endpoint: Endpoint, config: DashboardConfig): string
```

Generates Kusto query for response time monitoring.

## Examples

### Example 1: Basic Dashboard Generation

```bash
# Generate Terraform CDK code
yarn ts-node src/cli/index.ts generate \
  --config-file examples/basic-config.yaml
```

### Example 3: Programmatic Usage

```typescript
import { OA3Resolver } from './src/core/resolver';
import { parseEndpoints } from './src/utils/endpoint-parser';
import { AzureDashboardCdkBuilder } from './src/builders/azure-dashboard-cdk';

async function generateDashboard() {
  // Load OpenAPI spec
  const resolver = new OA3Resolver();
  const spec = await resolver.resolve('./api.yaml');

  // Parse configuration
  const config = {
    oa3_spec: './api.yaml',
    name: 'My Dashboard',
    location: 'East US',
    data_source: 'resource-id',
    // ... other config
  };

  // Parse endpoints
  config.endpoints = parseEndpoints(spec, config);

  // Generate dashboard
  const builder = new AzureDashboardCdkBuilder(config);
  const result = builder.build();

  console.log(result);
}
```

## Testing

### Running Tests

```bash
# Run all tests
yarn test

# Run with coverage
yarn test --coverage

# Run specific test file
yarn test resolver.test.ts

# Watch mode
yarn test --watch
```

### Test Structure

```
test/
├── unit/
│   ├── resolver.test.ts        # OpenAPI resolver tests
│   ├── endpoint-parser.test.ts # Endpoint parsing tests
│   ├── kusto-queries.test.ts   # Query generation tests
│   └── cli.test.ts            # CLI tests
└── integration/               # Integration tests (future)
```

### Test Coverage

Current test coverage includes:
- ✅ OpenAPI specification parsing
- ✅ Endpoint extraction and configuration
- ✅ Kusto query generation for both resource types
- ✅ CLI command structure and options
- ✅ Error handling and edge cases

## Development

### Prerequisites

- Node.js 18+
- Yarn 1.22+
- Azure CLI (for deployment)

### Development Workflow

```bash
# Install dependencies
yarn install

# Build in watch mode
yarn watch

# Run tests in watch mode
yarn test --watch

# Lint code
yarn lint

# Format code
yarn format
```

### Project Structure

```
packages/opex-dashboard-ts/
├── src/
│   ├── cli/                    # Command-line interface
│   │   ├── index.ts           # Main CLI entry
│   │   └── generate.ts        # Generate command
│   ├── core/                  # Core business logic
│   │   ├── resolver.ts        # OpenAPI parser
│   │   ├── kusto-queries.ts   # Kusto query templates
│   │   └── config.ts          # Configuration types
│   ├── constructs/            # CDKTF constructs
│   │   ├── azure-dashboard.ts    # Dashboard construct
│   │   ├── azure-alerts.ts       # Alerts construct
│   │   └── dashboard-properties.ts # Dashboard templates
│   ├── builders/              # Builder pattern
│   │   └── azure-dashboard-cdk.ts  # CDKTF builder
│   ├── types/                 # TypeScript definitions
│   │   ├── openapi.ts         # OpenAPI types
│   │   └── config.ts          # Configuration types
│   └── utils/                 # Utility functions
│       └── endpoint-parser.ts # Endpoint parsing
├── test/                      # Test files
│   ├── unit/                  # Unit tests
│   └── integration/           # Integration tests
├── examples/                  # Example configurations
├── package.json
├── tsconfig.json
├── cdktf.json
├── jest.config.js
└── README.md
```

## CDKTF Commands

```bash
# Initialize CDKTF (first time only)
yarn cdktf:init

# Synthesize Terraform configuration
yarn cdktf:synth

# Plan deployment
yarn cdktf:plan

# Deploy to Azure
yarn cdktf:deploy

# Destroy resources
yarn cdktf:destroy
```

## Troubleshooting

### Common Issues

1. **CDKTF Provider Issues**
   ```bash
   # Reinstall CDKTF providers
   yarn cdktf:get
   ```

2. **TypeScript Compilation Errors**
   ```bash
   # Clean and rebuild
   yarn clean
   yarn build
   ```

3. **OpenAPI Parsing Errors**
   - Ensure OpenAPI spec is valid JSON/YAML
   - Check file paths are correct
   - Verify network connectivity for remote specs

### Debug Mode

Enable debug logging:

```bash
DEBUG=cdktf:* yarn ts-node src/cli/index.ts generate --config-file config.yaml
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Style

- Use TypeScript strict mode
- Follow ESLint configuration
- Write comprehensive tests
- Update documentation for API changes

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Related Projects

- [opex-dashboard (Python)](https://github.com/pagopa/opex-dashboard) - Original Python implementation
- [CDK for Terraform](https://www.terraform.io/cdktf) - CDKTF documentation
- [Azure Monitor](https://docs.microsoft.com/en-us/azure/azure-monitor/) - Azure monitoring documentation

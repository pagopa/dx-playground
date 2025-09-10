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
yarn tsx src/cli/index.ts generate \
  --config-file config.yaml
```

## Architecture

This project follows **Hexagonal Architecture** (Ports & Adapters) principles, separating business logic from infrastructure concerns for better testability, maintainability, and extensibility.

### Core Principles

- **Domain Layer**: Pure business logic, independent of frameworks
- **Application Layer**: Use cases orchestrating domain services
- **Infrastructure Layer**: Adapters for external systems (CLI, files, OpenAPI, Terraform)

### Layer Structure

1. **Domain** (`src/domain/`)
   - **Entities**: Core business objects (`Endpoint`, `DashboardConfig`)
   - **Services**: Business logic (`EndpointParserService`, `KustoQueryService`)
   - **Ports**: Interfaces for external dependencies

2. **Application** (`src/application/`)
   - **Use Cases**: Orchestrate domain services (`GenerateDashboardUseCase`)

3. **Infrastructure** (`src/infrastructure/`)
   - **Adapters**: Concrete implementations of ports
     - CLI Adapter: Commander.js integration
     - OpenAPI Adapter: SwaggerParser integration
     - Terraform Adapter: CDKTF integration
     - File Adapter: File system operations
     - Config Adapter: Zod validation

### Key Components

#### Domain Services

- **EndpointParserService**: Parses OpenAPI specs into endpoint configurations
- **KustoQueryService**: Generates Azure Log Analytics queries

#### Application Use Cases

- **GenerateDashboardUseCase**: Main workflow for dashboard generation

#### Infrastructure Adapters

- **OpenAPISpecResolverAdapter**: Resolves OpenAPI specifications
- **TerraformGeneratorAdapter**: Generates CDKTF code
- **ConfigValidatorAdapter**: Validates configuration with Zod
- **FileReaderAdapter**: Reads YAML configuration files

### Benefits

- **Testability**: Domain logic tested in isolation with mock adapters
- **Extensibility**: Easy to add new adapters (e.g., AWS, different CLI frameworks)
- **Maintainability**: Clear separation of concerns
- **Framework Independence**: Domain layer free from CDKTF/Commander dependencies

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

## API Documentation

### Domain Layer

#### Entities

```typescript
interface Endpoint {
  path: string;
  availabilityThreshold?: number;
  responseTimeThreshold?: number;
  // ... other properties
}

interface DashboardConfig {
  oa3_spec: string;
  name: string;
  location: string;
  data_source: string;
  // ... other properties
}
```

#### Domain Services

```typescript
class EndpointParserService {
  parseEndpoints(spec: OpenAPISpec, config: DashboardConfig): Endpoint[];
}

class KustoQueryService {
  buildAvailabilityQuery(endpoint: Endpoint, config: DashboardConfig): string;
  buildResponseTimeQuery(endpoint: Endpoint, config: DashboardConfig): string;
  buildResponseCodesQuery(endpoint: Endpoint, config: DashboardConfig): string;
}
```

### Application Layer

#### Use Cases

```typescript
class GenerateDashboardUseCase {
  constructor(
    fileReader: IFileReader,
    configValidator: IConfigValidator,
    openAPISpecResolver: IOpenAPISpecResolver,
    endpointParser: IEndpointParser,
    kustoQueryGenerator: IKustoQueryGenerator,
    terraformGenerator: ITerraformGenerator,
  ) {}

  async execute(configFilePath: string): Promise<void>;
}
```

### Infrastructure Layer

#### Adapters

```typescript
class OpenAPISpecResolverAdapter implements IOpenAPISpecResolver {
  async resolve(specPath: string): Promise<OpenAPISpec>;
}

class TerraformGeneratorAdapter implements ITerraformGenerator {
  async generate(config: DashboardConfig): Promise<void>;
}

class ConfigValidatorAdapter implements IConfigValidator {
  validateConfig(rawConfig: unknown): DashboardConfig;
}

class FileReaderAdapter implements IFileReader {
  async readYamlFile(filePath: string): Promise<unknown>;
}
```

## Examples

### Example 1: Basic Dashboard Generation

```bash
# Generate Terraform CDK code
yarn tsx src/cli/index.ts generate \
  --config-file examples/basic-config.yaml
```

### Example 3: Programmatic Usage

```typescript
import { GenerateDashboardUseCase } from "./src/application/index.js";
import { FileReaderAdapter } from "./src/infrastructure/file/file-reader-adapter.js";
import { ConfigValidatorAdapter } from "./src/infrastructure/config/config-validator-adapter.js";
import { OpenAPISpecResolverAdapter } from "./src/infrastructure/openapi/openapi-spec-resolver-adapter.js";
import { EndpointParserService } from "./src/domain/services/endpoint-parser-service.js";
import { KustoQueryService } from "./src/domain/services/kusto-query-service.js";
import { TerraformGeneratorAdapter } from "./src/infrastructure/terraform/terraform-generator-adapter.js";

async function generateDashboard() {
  // Create adapters
  const fileReader = new FileReaderAdapter();
  const configValidator = new ConfigValidatorAdapter();
  const openAPISpecResolver = new OpenAPISpecResolverAdapter();
  const endpointParser = new EndpointParserService();
  const kustoQueryGenerator = new KustoQueryService();
  const terraformGenerator = new TerraformGeneratorAdapter();

  // Create use case
  const useCase = new GenerateDashboardUseCase(
    fileReader,
    configValidator,
    openAPISpecResolver,
    endpointParser,
    kustoQueryGenerator,
    terraformGenerator,
  );

  // Execute
  await useCase.execute("./config.yaml");
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
│   ├── domain/                    # Business logic layer
│   │   ├── entities/              # Core business objects
│   │   │   ├── endpoint.ts        # Endpoint entity
│   │   │   └── dashboard-config.ts # Configuration entity
│   │   ├── services/              # Domain services
│   │   │   ├── endpoint-parser-service.ts
│   │   │   └── kusto-query-service.ts
│   │   ├── ports/                 # Interface definitions
│   │   │   └── index.ts
│   │   └── index.ts               # Domain exports
│   ├── application/               # Application layer
│   │   ├── use-cases/             # Use case implementations
│   │   │   └── generate-dashboard-use-case.ts
│   │   └── index.ts               # Application exports
│   ├── infrastructure/            # Infrastructure layer
│   │   ├── cli/                   # CLI adapter
│   │   │   ├── index.ts
│   │   │   └── generate.ts
│   │   ├── openapi/               # OpenAPI adapter
│   │   │   └── openapi-spec-resolver-adapter.ts
│   │   ├── terraform/             # Terraform adapter
│   │   │   ├── azure-dashboard.ts
│   │   │   ├── azure-alerts.ts
│   │   │   ├── dashboard-properties.ts
│   │   │   └── terraform-generator-adapter.ts
│   │   ├── file/                  # File adapter
│   │   │   └── file-reader-adapter.ts
│   │   ├── config/                # Config adapter
│   │   │   └── config-validator-adapter.ts
│   │   └── index.ts               # Infrastructure exports
│   ├── shared/                    # Shared utilities
│   │   └── openapi.ts             # OpenAPI type guards
│   └── index.ts                   # Main exports
├── test/                          # Test files
│   └── unit/                      # Unit tests
├── examples/                      # Example configurations
├── package.json
├── tsconfig.json
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
DEBUG=cdktf:* yarn tsx src/cli/index.ts generate --config-file config.yaml
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

---
"to-do-webapp": patch
---

Build with Webpack instead of Turbopack to avoid a Next.js 16 Turbopack bug where externalized modules (e.g. `require-in-the-middle` used by OpenTelemetry via `@pagopa/azure-tracing`) are assigned hashed names that Node cannot resolve at runtime in the standalone output deployed to App Service.

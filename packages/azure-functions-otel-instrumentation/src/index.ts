import { AzureFunctionsInstrumentation } from "@azure/functions-opentelemetry-instrumentation";

export const instrumentAzureFunctions = () =>
  new AzureFunctionsInstrumentation({ enabled: true });

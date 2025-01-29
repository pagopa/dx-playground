import { createAzureSdkInstrumentation } from "@azure/opentelemetry-instrumentation-azure-sdk";
import { initDynatrace } from "@dynatrace/opentelemetry-azure-functions";
import { registerInstrumentations } from "@opentelemetry/instrumentation";

export const setupDynatrace = () => {
  // initDynatrace with OpenTelemetry setup (recommended)
  initDynatrace(true);

  // Register Azure SDK Instrumentation
  registerInstrumentations({
    instrumentations: [createAzureSdkInstrumentation()],
  });
};

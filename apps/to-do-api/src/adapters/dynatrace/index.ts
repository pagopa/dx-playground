import { createAzureSdkInstrumentation } from "@azure/opentelemetry-instrumentation-azure-sdk";
import { initDynatrace } from "@dynatrace/opentelemetry-azure-functions";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";

export const setupDynatrace = () => {
  // Register Azure SDK Instrumentation
  registerInstrumentations({
    instrumentations: [
      createAzureSdkInstrumentation({
        enabled: true,
      }),
      new HttpInstrumentation({
        enabled: true,
      }),
    ],
  });

  // initDynatrace with OpenTelemetry setup (recommended)
  initDynatrace(true);
};

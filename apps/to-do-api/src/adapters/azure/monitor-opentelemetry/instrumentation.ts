import {
  AzureMonitorOpenTelemetryOptions,
  useAzureMonitor,
} from "@azure/monitor-opentelemetry";
import { createAzureSdkInstrumentation } from "@azure/opentelemetry-instrumentation-azure-sdk";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { registerInstrumentations } from "@opentelemetry/instrumentation";

const options: AzureMonitorOpenTelemetryOptions = {
  instrumentationOptions: {
    azureSdk: {
      enabled: true,
    },
    http: {
      enabled: true,
    },
  },
  samplingRatio: Number(process.env.APPINSIGHTS_SAMPLING_PERCENTAGE) / 100 || 1,
};

useAzureMonitor(options);

registerInstrumentations({
  instrumentations: [
    getNodeAutoInstrumentations(),
    createAzureSdkInstrumentation(),
  ],
});

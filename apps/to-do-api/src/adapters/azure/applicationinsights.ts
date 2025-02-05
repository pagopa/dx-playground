import {
  AzureMonitorOpenTelemetryOptions,
  useAzureMonitor,
} from "@azure/monitor-opentelemetry";

const options: AzureMonitorOpenTelemetryOptions = {
  instrumentationOptions: {
    azureSdk: {
      enabled: true,
    },
    http: {
      enabled: true,
    },
  },
  samplingRatio: 1,
};

useAzureMonitor(options);

import { DefaultAzureCredential } from "@azure/identity";

export async function register() {
  const [{ initAzureMonitor }] = await Promise.all([
    import("@pagopa/azure-tracing/azure-monitor"),
  ]);

  initAzureMonitor([], {
    azureMonitorExporterOptions: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      connectionString: process.env.AZURE_MONITOR_CONNECTION_STRING!,
      credential: new DefaultAzureCredential(),
    },
    enableLiveMetrics: true,
    samplingRatio: 5,
    tracesPerSecond: 0,
  });

  console.log(
    "Azure Monitor OpenTelemetry has been initialized on the server.",
  );
}

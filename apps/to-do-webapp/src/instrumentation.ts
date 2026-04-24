export async function register() {
  const [{ initAzureMonitor }] = await Promise.all([
    import("@pagopa/azure-tracing/azure-monitor"),
  ]);

  initAzureMonitor([]);

  console.log(
    "Azure Monitor OpenTelemetry has been initialized on the server.",
  );
}

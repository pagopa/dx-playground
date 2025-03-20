import { AzureMonitorTraceExporter } from "@azure/monitor-opentelemetry-exporter";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import { registerOTel } from "@vercel/otel";

export async function register() {
  registerOTel({
    instrumentations: [new UndiciInstrumentation()],
    traceExporter: new AzureMonitorTraceExporter({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      connectionString: process.env.APPINSIGHTS_CONNSCTION_STRING!,
    }),
  });
}

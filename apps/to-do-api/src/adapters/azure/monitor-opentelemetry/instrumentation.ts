import { metrics, trace } from "@opentelemetry/api";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import appInsights from "applicationinsights";
import { instrumentAzureFunctions } from "azure-functions-otel-instrumentation/dist/index.js";

appInsights.setup().start();

registerInstrumentations({
  instrumentations: [instrumentAzureFunctions(), new UndiciInstrumentation()],
  meterProvider: metrics.getMeterProvider(),
  tracerProvider: trace.getTracerProvider(),
});

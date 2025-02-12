import { createAddHookMessageChannel } from "import-in-the-middle";
import { register } from "module";

const { registerOptions, waitForAllMessagesAcknowledged } =
  createAddHookMessageChannel();
register("import-in-the-middle/hook.mjs", import.meta.url, registerOptions);

/* eslint-disable */
import { initDynatrace } from "@dynatrace/opentelemetry-azure-functions"
/* eslint-enable */

import { createAzureSdkInstrumentation } from "@azure/opentelemetry-instrumentation-azure-sdk";
import { metrics, trace } from "@opentelemetry/api";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import { instrumentAzureFunctions } from "azure-functions-otel-instrumentation";

initDynatrace(true);

registerInstrumentations({
  instrumentations: [
    instrumentAzureFunctions(),
    createAzureSdkInstrumentation(),
    new UndiciInstrumentation(),
  ],
  meterProvider: metrics.getMeterProvider(),
  tracerProvider: trace.getTracerProvider(),
});

await waitForAllMessagesAcknowledged();

import { createAddHookMessageChannel } from "import-in-the-middle";
import { register } from "module";

const { registerOptions, waitForAllMessagesAcknowledged } =
  createAddHookMessageChannel();
register("import-in-the-middle/hook.mjs", import.meta.url, registerOptions);

/* eslint-disable */
import * as appInsights from "applicationinsights";
/* eslint-enable */

import { metrics, trace } from "@opentelemetry/api";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import { instrumentAzureFunctions } from "azure-functions-otel-instrumentation/dist/index.js";

appInsights.setup().start();

registerInstrumentations({
  instrumentations: [instrumentAzureFunctions(), new UndiciInstrumentation()],
  meterProvider: metrics.getMeterProvider(),
  tracerProvider: trace.getTracerProvider(),
});

await waitForAllMessagesAcknowledged();

import { initDynatrace } from "@dynatrace/opentelemetry-azure-functions";

export const setupDynatrace = () => {
  // initDynatrace with OpenTelemetry setup (recommended)
  initDynatrace(true);
};

import { logs } from "@opentelemetry/api-logs";

export const logCustomEvent =
  (eventName: string, attributes: Record<string, string>) =>
  (loggerName = "ApplicationInsightsLogger") => {
    logs.getLogger(loggerName).emit({
      attributes: {
        "microsoft.custom_event.name": eventName,
        ...attributes,
      },
    });
  };

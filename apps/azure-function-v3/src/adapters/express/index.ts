import { AzureFunction, Context } from "@azure/functions";
import { context as otelContext, propagation } from "@opentelemetry/api";
import createAzureFunctionHandler from "@pagopa/express-azure-functions/dist/src/createAzureFunctionsHandler.js";
import { Capabilities, listTasks } from "@to-do/domain";
import express, { Express } from "express";
import * as E from "fp-ts/lib/Either.js";

export const makeExpressApp = (env: Capabilities) => {
  const app = express();

  app.use(express.json());
  app.get("/api/tasks", async (req, res) => {
    const tasks = await listTasks()(env)();
    if (E.isLeft(tasks)) {
      return res.status(500).json({ message: "Error fetching tasks" });
    } else {
      res.json(tasks.right);
    }
  });

  return app;
};

export const expressToAzureFunction =
  (app: Express): AzureFunction =>
  (context: Context): void => {
    const traceContext = context.traceContext ?? {};
    const headers = {
      traceparent: traceContext.traceparent,
      tracestate: traceContext.tracestate,
    };

    const otelCtx = propagation.extract(otelContext.active(), headers);

    otelContext.with(otelCtx, () => {
      app.set("context", context);
      createAzureFunctionHandler.default(app)(context);
    });
  };

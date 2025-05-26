import { AzureFunction, Context } from "@azure/functions";
import { withOtelContextFunctionV3 } from "@pagopa/azure-tracing/azure-functions/v3";
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
    app.set("context", context);
    withOtelContextFunctionV3(context)(createAzureFunctionHandler.default(app));
  };

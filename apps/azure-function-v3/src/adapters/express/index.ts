import { AzureFunction, Context as FunctionContext } from "@azure/functions";
import { withOtelContextFunctionV3 } from "@pagopa/azure-tracing/azure-functions/v3";
import createAzureFunctionHandler from "@pagopa/express-azure-functions/dist/src/createAzureFunctionsHandler.js";
import express, { Express } from "express";

export const makeExpressApp = () => {
  const app = express();

  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  return app;
};

export const expressToAzureFunction =
  (app: Express): AzureFunction =>
  (context: FunctionContext): void => {
    app.set("context", context);
    withOtelContextFunctionV3(context)(createAzureFunctionHandler.default(app));
  };

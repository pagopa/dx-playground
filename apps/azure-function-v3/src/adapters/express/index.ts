import { AzureFunction, Context as FunctionContext } from "@azure/functions";
import { withOtelContextFunctionV3 } from "@pagopa/azure-tracing/azure-functions/v3";
import createAzureFunctionHandler from "@pagopa/express-azure-functions/dist/src/createAzureFunctionsHandler.js";
import { Express } from "express";

export const expressToAzureFunction =
  (app: Express): AzureFunction =>
  (context: FunctionContext): void => {
    app.set("context", context);
    withOtelContextFunctionV3(context)(createAzureFunctionHandler.default(app));
  };

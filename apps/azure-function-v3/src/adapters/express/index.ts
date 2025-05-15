import { AzureFunction, Context } from "@azure/functions";
import createAzureFunctionHandler from "@pagopa/express-azure-functions/dist/src/createAzureFunctionsHandler.js";
import express, { Express } from "express";

interface Task {
  id: string;
  state: "COMPLETED" | "DELETED" | "INCOMPLETE";
  title: string;
}

export const makeExpressApp = () => {
  const app = express();

  app.use(express.json());
  app.get("/api/tasks", (req, res) => {
    const taskList: readonly Task[] = [];
    res.json(taskList);
  });

  return app;
};

export const setAppContext = (app: express.Express, context: Context): void => {
  app.set("context", context);
};

export const expressToAzureFunction =
  (app: Express): AzureFunction =>
  (context: Context): void => {
    setAppContext(app, context);
    createAzureFunctionHandler.default(app)(context);
  };

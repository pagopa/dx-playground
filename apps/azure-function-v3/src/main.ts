import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { initAzureMonitor } from "@pagopa/azure-tracing/azure-monitor";
import {
  createCosmosClient,
  makeTaskRepository,
} from "@to-do/azure-adapters/cosmosdb";
import { Task } from "@to-do/domain";
import * as E from "fp-ts/lib/Either.js";
import { pipe } from "fp-ts/lib/function.js";

import {
  expressToAzureFunction,
  makeExpressApp,
} from "./adapters/express/index.js";
import { getConfigOrError } from "./config.js";

initAzureMonitor([new HttpInstrumentation(), new ExpressInstrumentation()]);

const config = pipe(
  getConfigOrError(process.env),
  E.getOrElseW((error) => {
    throw error;
  }),
);

const cosmosClient = createCosmosClient({ endpoint: config.cosmosDb.endpoint });

const db = cosmosClient.database(config.cosmosDb.dbName);
const taskContainer = db.container(config.cosmosDb.containers.tasks);

const env = {
  // Just a fake implementation, since it is not used in this function (v3)
  taskIdGenerator: {
    generate: () => `${Date.now()}` as Task["id"],
  },
  taskRepository: makeTaskRepository(taskContainer),
};

const app = makeExpressApp(env);
export const entryPoint = expressToAzureFunction(app);

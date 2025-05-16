import { CosmosClient } from "@azure/cosmos";
import { DefaultAzureCredential } from "@azure/identity";
import { Task } from "@to-do/domain";
import * as E from "fp-ts/lib/Either.js";
import { pipe } from "fp-ts/lib/function.js";

import { makeTaskRepository } from "./adapters/azure/cosmosdb/TaskRepository.js";
import {
  expressToAzureFunction,
  makeExpressApp,
} from "./adapters/express/index.js";
import { getConfigOrError } from "./config.js";

const config = pipe(
  getConfigOrError(process.env),
  E.getOrElseW((error) => {
    throw error;
  }),
);

const aadCredentials = new DefaultAzureCredential();
const cosmosClient = new CosmosClient({
  aadCredentials,
  endpoint: config.cosmosDb.endpoint,
});

const db = cosmosClient.database(config.cosmosDb.dbName);
const taskContainer = db.container(config.cosmosDb.containers.tasks);
const taskRepository = makeTaskRepository(taskContainer);

const env = {
  // Just a fake implementation, since it is not used in this function (v3)
  taskIdGenerator: {
    generate: () => `${Date.now()}` as Task["id"],
  },
  taskRepository,
};

const app = makeExpressApp(env);
export const entryPoint = expressToAzureFunction(app);

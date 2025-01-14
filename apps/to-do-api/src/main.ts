import { CosmosClient } from "@azure/cosmos";
import { app } from "@azure/functions";
import { DefaultAzureCredential } from "@azure/identity";
import * as E from "fp-ts/lib/Either.js";
import { pipe } from "fp-ts/lib/function.js";

import { makeTaskRepository } from "./adapters/azure/cosmosdb/TaskRepository.js";
import { makePostTaskHandler } from "./adapters/azure/functions/create-task.js";
import { makeInfoHandler } from "./adapters/azure/functions/info.js";
import { makeTaskIdGenerator } from "./adapters/ulid/id-generator.js";
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
// FIXME: Get container name from config
const taskContainer = db.container("tasks");

const env = {
  taskIdGenerator: makeTaskIdGenerator(),
  taskRepository: makeTaskRepository(taskContainer),
};

app.http("info", {
  authLevel: "anonymous",
  handler: makeInfoHandler({ cosmosClient }),
  methods: ["GET"],
  route: "info",
});

app.http("createTask", {
  authLevel: "function",
  handler: makePostTaskHandler(env),
  methods: ["POST"],
  route: "tasks",
});

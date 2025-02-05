/* eslint-disable */
import "./adapters/azure/applicationinsights.js";
/* eslint-enable */

import { CosmosClient } from "@azure/cosmos";
import { app } from "@azure/functions";
import { DefaultAzureCredential } from "@azure/identity";
import * as E from "fp-ts/lib/Either.js";
import { pipe } from "fp-ts/lib/function.js";

import { makeTaskRepository } from "./adapters/azure/cosmosdb/TaskRepository.js";
import { makePostTaskHandler } from "./adapters/azure/functions/create-task.js";
import { makeDeleteTaskHandler } from "./adapters/azure/functions/delete-task.js";
import { makeGetTaskHandler } from "./adapters/azure/functions/get-task.js";
import { makeGetTasksHandler } from "./adapters/azure/functions/get-tasks.js";
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
const taskContainer = db.container(config.cosmosDb.containers.tasks);

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
  handler: (req, context) => {
    context.trace("CREATING A TASK");
    context.debug("CREATING A TASK");
    context.log("CREATING A TASK");
    context.warn("CREATING A TASK");
    context.error("CREATING A TASK");
    return makePostTaskHandler(env)(req, context);
  },
  methods: ["POST"],
  route: "tasks",
});

app.http("getTaskById", {
  authLevel: "function",
  handler: makeGetTaskHandler(env),
  methods: ["GET"],
  route: "tasks/{taskId}",
});

app.http("getTask", {
  authLevel: "function",
  handler: makeGetTasksHandler(env),
  methods: ["GET"],
  route: "tasks",
});

app.http("deleteTask", {
  authLevel: "function",
  handler: makeDeleteTaskHandler(env),
  methods: ["DELETE"],
  route: "tasks/{taskId}",
});

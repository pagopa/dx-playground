import { app } from "@azure/functions";
import { registerAzureFunctionHooks } from "@pagopa/azure-tracing/azure-functions";
import {
  createCosmosClient,
  makeTaskRepository,
} from "@to-do/azure-adapters/cosmosdb";
import * as E from "fp-ts/lib/Either.js";
import { pipe } from "fp-ts/lib/function.js";

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

const cosmosClient = createCosmosClient({ endpoint: config.cosmosDb.endpoint });

const db = cosmosClient.database(config.cosmosDb.dbName);
const taskContainer = db.container(config.cosmosDb.containers.tasks);

const env = {
  taskIdGenerator: makeTaskIdGenerator(),
  taskRepository: makeTaskRepository(taskContainer),
};

registerAzureFunctionHooks(app);

app.http("info", {
  authLevel: "anonymous",
  handler: makeInfoHandler({ cosmosClient }),
  methods: ["GET"],
  route: "info",
});

app.http("createTask", {
  authLevel: "anonymous",
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
  authLevel: "anonymous",
  handler: makeGetTaskHandler(env),
  methods: ["GET"],
  route: "tasks/{taskId}",
});

app.http("getTask", {
  authLevel: "anonymous",
  handler: makeGetTasksHandler(env),
  methods: ["GET"],
  route: "tasks",
});

app.http("deleteTask", {
  authLevel: "anonymous",
  handler: makeDeleteTaskHandler(env),
  methods: ["DELETE"],
  route: "tasks/{taskId}",
});

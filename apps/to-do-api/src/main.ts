import { CosmosClient } from "@azure/cosmos";
import { app } from "@azure/functions";
import { DefaultAzureCredential } from "@azure/identity";
import * as E from "fp-ts/lib/Either.js";
import { pipe } from "fp-ts/lib/function.js";

import { makePostTaskHandler } from "./adapters/azure/functions/create-task.js";
import { makeInfoHandler } from "./adapters/azure/functions/info.js";
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

app.http("info", {
  authLevel: "anonymous",
  handler: makeInfoHandler({ cosmosClient }),
  methods: ["GET"],
  route: "info",
});

app.http("createTask", {
  authLevel: "function",
  handler: makePostTaskHandler({}),
  methods: ["POST"],
  route: "tasks",
});

import { app } from "@azure/functions";

import { makeInfoHandler } from "./adapters/azure/functions/info";

app.http("info", {
  authLevel: "anonymous",
  handler: makeInfoHandler({}),
  methods: ["GET"],
  route: "info",
});

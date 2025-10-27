import createAzureFunctionHandler from "@pagopa/express-azure-functions/dist/src/createAzureFunctionsHandler.js";

import express from "express";

const app = express();

app.use(express.json());

app.get("/api/hello", async (req, res) => {
  res.json({ message: "Hello, World FROM NEW VERSION - now multiple revision enabled!" });
});

export default createAzureFunctionHandler.default(app);

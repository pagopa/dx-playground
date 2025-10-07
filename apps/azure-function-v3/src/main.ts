import {
  expressToAzureFunction,
} from "./adapters/express/index.js";

import express from "express";

const app = express();

app.use(express.json());
app.get("/api/hello", async (req, res) => {
  res.json({ message: "Hello from Azure Function v3!" });
});

app.get("/api/auth", async (req, res) => {
  res.json({ message: "Hello from Azure Function v3 (Auth)!" });
});

export const entryPoint = expressToAzureFunction(app);

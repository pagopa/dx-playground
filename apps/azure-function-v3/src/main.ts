import {
  expressToAzureFunction,
  makeExpressApp,
} from "./adapters/express/index.js";

const app = makeExpressApp();
export const entryPoint = expressToAzureFunction(app);

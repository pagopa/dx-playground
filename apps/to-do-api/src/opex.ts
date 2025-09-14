// import { App, AzurermBackend } from "cdktf";
// import { MonitoringStack } from "cdktf-monitoring-stack";
// import { backendConfig, opexConfig } from "opex-common";

// const app = new App();

// // Use the following lines if you need to resolve paths dynamically
// //
// // import * as path from "path";
// // import { fileURLToPath } from "url";
// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);
// //
// const stack = new MonitoringStack(app, "to-do-api", {
//   config: opexConfig,
//   openApiFilePaths: ["docs/openapi.yaml"],
// });

// new AzurermBackend(stack, {
//   ...backendConfig,
//   key: "dx.opex.to-do-api.tfstate",
// });

// app.synth();

import { App } from "cdktf";
import { MonitoringStack } from "cdktf-monitoring-stack";
import { opexConfig } from "opex-common";

const app = new App();

// Use the following lines if you need to resolve paths dynamically
//
// import * as path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//
new MonitoringStack(app, "to-do-api", {
  config: opexConfig,
  openApiFilePath: "docs/openapi.yaml",
});

app.synth();

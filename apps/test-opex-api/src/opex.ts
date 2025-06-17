import { App } from "cdktf";
import { MonitoringStack } from "cdktf-monitoring-stack";
import { opexConfig } from "opex-common";

const app = new App();

new MonitoringStack(app, "to-do-api-v2", {
  config: opexConfig,
  openApiFilePath: "docs/openapi-v2.yaml",
});

new MonitoringStack(app, "to-do-api-v3", {
  config: opexConfig,
  openApiFilePath: "docs/openapi-v3.yaml",
});

app.synth();

import { App } from "cdktf";
import { MonitoringStack } from "cdktf-monitoring-stack";
import { opexConfig } from "opex-common";

const app = new App();

new MonitoringStack(app, "to-do-api-v2", {
  config: opexConfig,
  openApiFilePaths: ["docs/openapi-v2.yaml", "docs/openapi-v3.yaml"],
});

app.synth();

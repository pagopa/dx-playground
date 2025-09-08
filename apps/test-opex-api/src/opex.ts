import { App, AzurermBackend } from "cdktf";
import { MonitoringStack } from "cdktf-monitoring-stack";
import { backendConfig, opexConfig } from "opex-common";

process.env.SYNTH_HCL_OUTPUT = "true";

const app = new App({
  hclOutput: true,
});

const stack1 = new MonitoringStack(app, "test-opex-api-v1", {
  config: opexConfig,
  openApiFilePaths: ["docs/openapi-v2.yaml"],
});

new AzurermBackend(stack1, {
  ...backendConfig,
  key: "dx.test-opex-api1.tfstate",
});

///////

const stack2 = new MonitoringStack(app, "test-opex-api-v2", {
  config: opexConfig,
  openApiFilePaths: ["docs/openapi-v3.yaml"],
});

new AzurermBackend(stack2, {
  ...backendConfig,
  key: "dx.test-opex-api2.tfstate",
});

///////

const stack3 = new MonitoringStack(app, "test-opex-api-v3", {
  config: opexConfig,
  openApiFilePaths: ["docs/io_backend_light.yaml"],
});

new AzurermBackend(stack3, {
  ...backendConfig,
  key: "dx.test-opex-api3.tfstate",
});

///////

app.synth();

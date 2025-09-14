import { App } from "cdktf";

import {
  ITerraformFileGenerator,
  ValidDashboardConfig,
} from "../../domain/index.js";
import { AzureOpexStack } from "./azure-dashboard.js";

export class TerraformFileGeneratorAdapter implements ITerraformFileGenerator {
  async generate(config: ValidDashboardConfig): Promise<void> {
    // Create CDKTF app
    const app = new App({ hclOutput: true, outdir: "opex" });

    // Create the main stack
    new AzureOpexStack(app, "opex-dashboard", config);

    // Generate Terraform code
    app.synth();
  }
}

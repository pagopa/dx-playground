import { App } from "cdktf";

import { DashboardConfig, ITerraformGenerator } from "../../domain/index.js";
import { AzureOpexStack } from "./azure-dashboard.js";

export class TerraformGeneratorAdapter implements ITerraformGenerator {
  async generate(config: DashboardConfig): Promise<void> {
    // Create CDKTF app
    const app = new App({ hclOutput: true, outdir: "opex" });

    // Create the main stack
    new AzureOpexStack(app, "opex-dashboard", config);

    // Generate Terraform code
    app.synth();
  }
}

import { App } from "cdktf";

import {
  ITerraformStackGenerator,
  ValidDashboardConfig,
} from "../../domain/index.js";
import { AzureOpexStack } from "./azure-dashboard.js";

export class TerraformStackGeneratorAdapter
  implements ITerraformStackGenerator
{
  async generate(
    config: ValidDashboardConfig,
    app: App,
  ): Promise<AzureOpexStack> {
    // Create and return the stack using the provided app
    const opexStack = new AzureOpexStack(app, "opex-dashboard", config);
    return opexStack;
  }
}

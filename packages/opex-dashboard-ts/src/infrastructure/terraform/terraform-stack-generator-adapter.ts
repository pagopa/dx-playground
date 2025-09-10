import { App } from "cdktf";

import {
  DashboardConfig,
  ITerraformStackGenerator,
} from "../../domain/index.js";
import { AzureOpexStack } from "./azure-dashboard.js";

export class TerraformStackGeneratorAdapter
  implements ITerraformStackGenerator
{
  async generate(config: DashboardConfig, app: App): Promise<AzureOpexStack> {
    // Create and return the stack using the provided app
    const opexStack = new AzureOpexStack(app, "opex-dashboard", config);
    return opexStack;
  }
}

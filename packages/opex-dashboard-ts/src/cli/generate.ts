/* eslint-disable no-console */
import { App } from "cdktf";
import { Command } from "commander";
import * as fs from "fs";
import * as yaml from "js-yaml";

import { DashboardConfig } from "../utils/config-validation.js";
import { addAzureDashboard } from "../core/add-azure-dashboard.js";

export const generateCommand = new Command()
  .name("generate")
  .description("Generate dashboard definition")
  .requiredOption("-c, --config-file <file>", "YAML config file")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .action(async (options: any) => {
    try {
      const app = new App({ hclOutput: true, outdir: "opex" });

      // Load and parse configuration
      const configFile = fs.readFileSync(options.configFile, "utf8");
      const rawConfig = yaml.load(configFile);

      // Use the programmatic function
      // Cast here is safe since validateConfig will check the structure
      await addAzureDashboard({ config: rawConfig as DashboardConfig, app });

      // Generate the Terraform code using local backend
      app.synth();

      // Output result
      console.log("Terraform CDKTF code generated successfully");
    } catch (error: unknown) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : "Unknown error",
        { cause: error },
      );
      process.exit(1);
    }
  });

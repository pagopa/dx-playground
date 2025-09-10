#!/usr/bin/env node

import { Command } from "commander";

import { generateCommand } from "./generate.js";

const program = new Command();

program
  .name("opex-dashboard-ts")
  .description(
    "Generate standardized PagoPA Operational Excellence dashboards from OpenAPI specs",
  )
  .version("1.0.0");

program.addCommand(generateCommand);

program.parse();

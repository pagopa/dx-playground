import { z } from "zod";

import {
  DashboardConfig,
  DashboardConfigSchema,
  IConfigValidator,
  mergeConfigWithDefaults,
} from "../../domain/index.js";

export class ConfigValidatorAdapter implements IConfigValidator {
  validateConfig(rawConfig: unknown): DashboardConfig {
    // Parse and validate with zod using safeParse
    const result = DashboardConfigSchema.safeParse(rawConfig);

    if (!result.success) {
      // Format validation errors
      const errorMessage = result.error.issues
        .map((err) => `• ${err.path.join(".")}: ${err.message}`)
        .join("\n");
      throw new Error(`Configuration validation failed:\n${errorMessage}`);
    }

    // Apply defaults
    return mergeConfigWithDefaults(result.data);
  }
}

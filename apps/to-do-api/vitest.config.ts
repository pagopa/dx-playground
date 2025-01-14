import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        "**/__tests__/data.ts",
        "**/generated/**",
        "**/coverage/**",
        ".yarn",
      ],
      provider: "v8",
    },
  },
});

import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: "src/index.ts",
    cli: "src/infrastructure/cli/index.ts",
  },
  format: ["esm", "cjs"],
  outDir: "dist",
  target: "esnext",
  tsconfig: "./tsconfig.json",
});

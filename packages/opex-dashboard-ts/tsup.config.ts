import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: false,
  entry: ["src/cli/index.ts"],
  format: ["esm", "cjs"],
  outDir: "dist",
  target: "esnext",
  tsconfig: "./tsconfig.json",
});

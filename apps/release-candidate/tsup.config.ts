import { defineConfig } from "tsup";

export default defineConfig({
  bundle: true,
  clean: true,
  entry: ["src/index.ts"],
  external: ["@changesets/*"],
  format: ["esm"],
  outDir: "dist",
  splitting: false,
  target: "esnext",
});

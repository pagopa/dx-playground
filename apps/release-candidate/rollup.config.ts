import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { builtinModules } from "node:module";
import { defineConfig } from "rollup";

const config = defineConfig({
  external: [...builtinModules, "@changesets/cli"],
  input: "src/index.ts",
  output: {
    esModule: true,
    file: "dist/index.cjs",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    typescript(),
    nodeResolve({ preferBuiltins: true }),
    json(),
    commonjs(),
  ],
});

export default config;

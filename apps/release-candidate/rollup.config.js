import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import { transform } from "esbuild";
import { builtinModules } from "node:module";
import { defineConfig } from "rollup";

export default defineConfig({
  external: (id) => builtinModules.includes(id),
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "esm",
  },
  plugins: [
    nodeResolve({
      preferBuiltins: false,
    }),
    json(),
    commonjs(),
    {
      name: "esbuild",
      async transform(code, id) {
        if (!/\.(mts|cts|ts|tsx)$/.test(id)) {
          return null;
        }
        const result = await transform(code, {
          loader: "ts",
        });
        return result.code;
      },
    },
    terser(),
  ],
});

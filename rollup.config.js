import typescript from "rollup-plugin-typescript2";
import nodeResolve from "rollup-plugin-node-resolve";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  plugins: [
    typescript({
      importHelpers: false
    })
  ],
  external: ["tslib"],
  output: [
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "es" }
  ]
};

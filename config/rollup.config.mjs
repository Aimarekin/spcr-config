import babel from "@rollup/plugin-babel"
import typescript from "@rollup/plugin-typescript"

export default {
  input: {
    index: "src/index.ts"
  },
  output: { dir: "dist", format: "esm", preserveModules: true },
  plugins: [
    babel({
      babelHelpers: "bundled",
      configFile: "./config/babel.config.js",
      presets: [["@babel/env", { modules: false }]]
    }),
    typescript({ outDir: "dist", declaration: true, declarationDir: "dist" })
  ],
  treeshake: { moduleSideEffects: false, propertyReadSideEffects: false }
}
import * as esbuild from "esbuild"

import { glob } from "glob"

const entry = await glob("src/index.{js,jsx,ts,tsx}")

if (!entry.length) {
    console.error("No entry points found!")
    process.exit(1)
}
else if (entry.length > 1) {
    console.error("Multiple entry points found! " + entry.join(", "))
    process.exit(1)
}

esbuild.build({
    entryPoints: entry,
    outfile: "dist/index.js",
    bundle: true,
    minify: true,
    platform: "browser",
    logLevel: "info",
    sourcemap: true,
    target: "chrome106", // This is the chrome version of oldest supported version of Spotify (1.2.0)
    plugins: [
        nodeExternalsPlugin()
    ],
    metafile: true
}).then(async (res) => {
    console.log(await esbuild.analyzeMetafile(res.metafile, {
        verbose: options.verbose,
    }))
}).catch(() => process.exit(1))
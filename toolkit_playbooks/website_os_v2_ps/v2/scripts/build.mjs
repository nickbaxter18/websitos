import esbuild from "esbuild";
// pipeline (ESM)
await esbuild.build({ entryPoints:["v2/core/pipeline.ts"], outfile:"build/core/pipeline.js", bundle:true, platform:"node", format:"esm", target:["node18"], sourcemap:true });
// server (CJS)
await esbuild.build({ entryPoints:["v2/server/index.ts"], outfile:"build/server/index.cjs", bundle:true, platform:"node", format:"cjs", target:["node18"], sourcemap:true, packages:"external" });

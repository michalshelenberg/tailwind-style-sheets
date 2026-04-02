import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts", "src/loader.ts"],
    format: ["cjs"],
    external: ["./loader"],
    dts: true,
  },
  {
    entry: ["src/index.ts", "src/vite.ts"],
    format: ["esm"],
    external: ["vite"],
    dts: true,
  },
  {
    entry: ["src/cli.ts"],
    format: ["cjs"],
    esbuildOptions(options) {
      options.banner = { js: "#!/usr/bin/env node" };
    },
  },
]);

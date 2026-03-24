import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts", "src/loader.ts"],
    format: ["cjs"],
    external: ["./loader"],
    dts: true,
    clean: true,
  },
  {
    entry: ["src/cli.ts"],
    format: ["cjs"],
    banner: { js: "#!/usr/bin/env node" },
  },
]);

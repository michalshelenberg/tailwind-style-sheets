import { parseTwss } from "./parse";
import type { Plugin } from "vite";

export function twssVitePlugin(): Plugin {
  return {
    name: "tailwind-style-sheets",

    transform(code, id) {
      if (!id.endsWith(".twss")) return null;

      const styles = parseTwss(code);
      return {
        code: `export default ${JSON.stringify(styles)};`,
        map: null,
      };
    },

    handleHotUpdate({ file, server }) {
      if (!file.endsWith(".twss")) return;

      const mod = server.moduleGraph.getModuleById(file);
      if (mod) {
        server.moduleGraph.invalidateModule(mod);
        server.hot.send({ type: "full-reload" });
      }
    },
  };
}

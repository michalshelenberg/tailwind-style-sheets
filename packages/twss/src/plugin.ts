import fs from "fs";
import type { NextConfig } from "next";

export interface TwssPluginOptions {
  /**
   * Absolute path to your global CSS file (e.g. `src/app/globals.css`).
   * Touched on `.twss` file changes to trigger Tailwind's class scan and HMR.
   */
  globalsCSS?: string;
  /**
   * Directory to watch recursively for `.twss` file changes.
   * Only active in `development`. Omit to disable the HMR watcher.
   */
  watchDir?: string;
}

/**
 * Next.js plugin that enables `.twss` file imports as Tailwind class maps.
 *
 * Registers the Turbopack loader for `*.twss` files and, in development,
 * watches `watchDir` for changes — touching `globalsCSS` on each change
 * so Next.js re-runs Tailwind's class scan and hot-reloads styles.
 *
 * @example
 * // next.config.ts
 * import path from "path";
 * import { withTwssPlugin } from "twss";
 *
 * export default withTwssPlugin({}, {
 *   globalsCSS: path.resolve(__dirname, "src/app/globals.css"),
 *   watchDir: path.resolve(__dirname, "src"),
 * });
 */
export function withTwssPlugin(nextConfig: NextConfig, options: TwssPluginOptions = {}): NextConfig {
  const { globalsCSS, watchDir } = options;

  if (process.env.NODE_ENV === "development" && globalsCSS && watchDir) {
    fs.watch(watchDir, { recursive: true }, (_, filename) => {
      if (filename?.endsWith(".twss")) {
        const now = new Date();
        fs.utimesSync(globalsCSS, now, now);
      }
    });
  }

  return {
    ...nextConfig,
    turbopack: {
      ...nextConfig.turbopack,
      rules: {
        ...nextConfig.turbopack?.rules,
        "*.twss": {
          loaders: [require.resolve("./loader")],
          as: "*.js",
        },
      },
    },
  };
}

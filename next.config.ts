import type { NextConfig } from "next";
import path from "path";
import { withTwssPlugin } from "@michalshelenberg/tailwind-style-sheets";

const nextConfig: NextConfig = {};

export default withTwssPlugin(nextConfig, {
  globalsCSS: path.resolve(__dirname, "src/app/globals.css"),
  watchDir: path.resolve(__dirname, "src"),
});

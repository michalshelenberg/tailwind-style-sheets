# twss

A Turbopack loader and Next.js plugin for `.twss` files — co-locate your Tailwind class maps alongside components.

## What it does

`.twss` files use a CSS-like syntax to define named Tailwind class groups:

```css
/* Button.styles.twss */
.base {
  @apply px-4 py-2 rounded font-semibold;
}

.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
```

Importing a `.twss` file gives you a plain object:

```ts
import styles from "./Button.styles.twss";
// styles.base    → "px-4 py-2 rounded font-semibold"
// styles.primary → "bg-blue-600 text-white hover:bg-blue-700"
```

## Installation

```bash
npx twss init
```

This scaffolds all required files and installs the package. To set up manually:

```bash
npm install twss
```

## Setup

### `next.config.ts`

```ts
import type { NextConfig } from "next";
import path from "path";
import { withTwssPlugin } from "twss";

const nextConfig: NextConfig = {};

export default withTwssPlugin(nextConfig, {
  globalsCSS: path.resolve(__dirname, "src/app/globals.css"),
  watchDir: path.resolve(__dirname, "src"),
});
```

`withTwssPlugin` options:

| Option       | Type     | Description                                                                          |
| ------------ | -------- | ------------------------------------------------------------------------------------ |
| `globalsCSS` | `string` | Absolute path to your global CSS file. Touched on `.twss` changes to trigger HMR.   |
| `watchDir`   | `string` | Directory to watch recursively for `.twss` file changes. Only active in development. |

Both options are optional. Omitting them disables the HMR watcher (the loader still works).

### TypeScript

Add a declaration file so TypeScript knows `.twss` imports return `Record<string, string>`:

```ts
// global.d.ts
declare module "*.twss" {
  const styles: Record<string, string>;
  export default styles;
}
```

### VSCode

Install the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension to get Tailwind class autocomplete and hover previews inside `.twss` files.

Add to `.vscode/settings.json` to get CSS syntax highlighting and silence the `@apply` warning:

```json
{
  "css.lint.unknownAtRules": "ignore",
  "files.associations": {
    "*.twss": "css"
  }
}
```

## How it works

1. **Loader** (`loader.ts`) — Turbopack passes the raw `.twss` file content through the loader. A regex extracts each `.className { @apply ... }` block and converts it to `export default { className: "class1 class2 ..." }`.

2. **HMR watcher** (`plugin.ts`) — In development, `fs.watch` monitors `watchDir` for `.twss` changes. When a change is detected, it touches `globalsCSS`, which causes Next.js to re-run Tailwind's class scan and hot-reload styles.

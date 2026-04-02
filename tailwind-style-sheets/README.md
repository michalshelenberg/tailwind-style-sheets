# tailwind-style-sheets

Use standard CSS class names in your components — `.twss` files map them to Tailwind utilities at build time.

## What it does

Define your class names and their Tailwind mappings in `.twss` files using familiar CSS syntax with `@apply`:

```css
/* Button.styles.twss */
.button {
  @apply
  cursor-pointer
  px-4
  py-2
  rounded-full
  text-sm
  font-medium
  transition-all
  active:scale-95
}

.button--primary {
  @apply
  bg-blue-600
  text-white
  hover:bg-blue-700
}

.button--ghost {
  @apply
  bg-transparent
  text-blue-600
  hover:bg-blue-50
}
```

Inline is also valid:

```css
.button {
  @apply cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95
}
```

## Usage

```tsx
import { twcn } from "tailwind-style-sheets";
import styles from "./Button.styles.twss";

const cn = twcn(styles);

export function Button({ variant = "primary", className, children, ...props }) {
  return (
    <button {...props} className={cn("button", `button--${variant}`, className)}>
      {children}
    </button>
  );
}
```

`twcn` takes the imported styles object, and returns a function that resolves class names with `tailwind-merge` — pass it style keys, modifiers, and an optional `className` override.

## Installation

```bash
npx tailwind-style-sheets init
```

This scaffolds all required files and installs the package.

## Manual installation

```bash
npm install tailwind-style-sheets
```

### Next.js (Turbopack)

```ts
// next.config.ts
import type { NextConfig } from "next";
import path from "path";
import { withTwssPlugin } from "tailwind-style-sheets";

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

### Vite

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { twssVitePlugin } from "tailwind-style-sheets/vite";

export default defineConfig({
  plugins: [react(), tailwindcss(), twssVitePlugin()],
});
```

The Vite plugin transforms `.twss` files and handles HMR automatically — no additional options needed.

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

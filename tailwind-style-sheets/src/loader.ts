/**
 * Turbopack loader for .twss files.
 *
 * Parses CSS-like blocks using `@apply` and emits a JS module that maps
 * each class name to a plain Tailwind class string.
 *
 * Input (.twss file):
 *   .base {
 *     @apply px-4 py-2 rounded font-semibold;
 *   }
 *   .primary {
 *     @apply bg-blue-600 text-white hover:bg-blue-700;
 *   }
 *
 * Output (JS module):
 *   export default { base: "px-4 py-2 rounded font-semibold", primary: "bg-blue-600 text-white hover:bg-blue-700" }
 */
import { parseTwss } from "./parse";

const twssLoader: (source: string) => string = function (source) {
  return `export default ${JSON.stringify(parseTwss(source))};`;
};

export default twssLoader;

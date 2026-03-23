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
const BLOCK_REGEX = /\.(\w[\w-]*)\s*\{\s*@apply\s+([\s\S]*?)\s*\}/g;

const twssLoader: (source: string) => string = function (source) {
  const styles: Record<string, string> = {};

  let match: RegExpExecArray | null;
  while ((match = BLOCK_REGEX.exec(source)) !== null) {
    const [, className, classes] = match;
    styles[className] = classes.trim().replace(/\s+/g, " ");
  }

  return `export default ${JSON.stringify(styles)};`;
};

export = twssLoader;

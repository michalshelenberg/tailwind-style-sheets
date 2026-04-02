const BLOCK_REGEX = /\.(\w[\w-]*)\s*\{\s*@apply\s+([\s\S]*?)\s*\}/g;

export function parseTwss(source: string): Record<string, string> {
  const styles: Record<string, string> = {};

  let match: RegExpExecArray | null;
  while ((match = BLOCK_REGEX.exec(source)) !== null) {
    const [, className, classes] = match;
    styles[className] = classes.trim().replace(/\s+/g, " ");
  }

  return styles;
}

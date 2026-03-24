import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const cwd = process.cwd();

function writeIfAbsent(filePath: string, content: string) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`created  ${path.relative(cwd, filePath)}`);
  } else {
    console.log(`skipped  ${path.relative(cwd, filePath)} (already exists)`);
  }
}

function appendIfMissing(filePath: string, line: string) {
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  if (!existing.includes(line)) {
    fs.writeFileSync(filePath, existing + (existing.endsWith("\n") || existing === "" ? "" : "\n") + line + "\n", "utf8");
    console.log(`updated  ${path.relative(cwd, filePath)}`);
  } else {
    console.log(`skipped  ${path.relative(cwd, filePath)} (already contains entry)`);
  }
}

// global.d.ts
writeIfAbsent(
  path.join(cwd, "global.d.ts"),
  `declare module "*.twss" {\n  const styles: Record<string, string>;\n  export default styles;\n}\n`
);

// .prettierignore
appendIfMissing(path.join(cwd, ".prettierignore"), "**/*.twss");

// .vscode/settings.json
const vscodeDir = path.join(cwd, ".vscode");
if (!fs.existsSync(vscodeDir)) fs.mkdirSync(vscodeDir);

const vscodeSettings = path.join(vscodeDir, "settings.json");
const settings = fs.existsSync(vscodeSettings)
  ? JSON.parse(fs.readFileSync(vscodeSettings, "utf8"))
  : {};

let vscodeChanged = false;
if (settings["css.lint.unknownAtRules"] !== "ignore") {
  settings["css.lint.unknownAtRules"] = "ignore";
  vscodeChanged = true;
}
if (!settings["files.associations"]?.["*.twss"]) {
  settings["files.associations"] = { ...settings["files.associations"], "*.twss": "css" };
  vscodeChanged = true;
}
if (vscodeChanged) {
  fs.writeFileSync(vscodeSettings, JSON.stringify(settings, null, 2) + "\n", "utf8");
  console.log(`updated  .vscode/settings.json`);
} else {
  console.log(`skipped  .vscode/settings.json (already configured)`);
}

// install twss
console.log("installing @michalshelenberg/twss...");
execSync("npm install @michalshelenberg/twss", { stdio: "inherit", cwd });

// next.config.ts
const nextConfigPath = ["next.config.ts", "next.config.mjs", "next.config.js"]
  .map((f) => path.join(cwd, f))
  .find((f) => fs.existsSync(f));

if (!nextConfigPath) {
  console.log("skipped  next.config.ts (not found)");
} else {
  let src = fs.readFileSync(nextConfigPath, "utf8");
  if (src.includes("withTwssPlugin")) {
    console.log(`skipped  ${path.relative(cwd, nextConfigPath)} (already contains withTwssPlugin)`);
  } else {
    // add imports after the last existing import line
    const lastImportIdx = [...src.matchAll(/^import .+$/gm)].at(-1);
    const insertAfter = lastImportIdx
      ? lastImportIdx.index! + lastImportIdx[0].length
      : 0;
    const imports = `\nimport path from "path";\nimport { withTwssPlugin } from "@michalshelenberg/twss";`;
    src = src.slice(0, insertAfter) + imports + src.slice(insertAfter);

    // wrap export default <id>; with withTwssPlugin
    src = src.replace(
      /export default (\w+);/,
      `export default withTwssPlugin($1, {\n  globalsCSS: path.resolve(__dirname, "src/app/globals.css"),\n  watchDir: path.resolve(__dirname, "src"),\n});`
    );

    fs.writeFileSync(nextConfigPath, src, "utf8");
    console.log(`updated  ${path.relative(cwd, nextConfigPath)}`);
  }
}

console.log("\ndone.");

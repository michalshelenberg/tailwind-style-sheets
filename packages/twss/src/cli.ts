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

console.log("\ndone. add withTwssPlugin to your next.config.ts:");
console.log(`
  import path from "path";
  import { withTwssPlugin } from "@michalshelenberg/twss";

  export default withTwssPlugin(nextConfig, {
    globalsCSS: path.resolve(__dirname, "src/app/globals.css"),
    watchDir: path.resolve(__dirname, "src"),
  });
`);

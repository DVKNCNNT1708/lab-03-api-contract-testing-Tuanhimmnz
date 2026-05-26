const { mkdirSync, writeFileSync } = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");

mkdirSync("reports", { recursive: true });

const spectralCli = path.join("node_modules", "@stoplight", "spectral-cli", "dist", "index.js");
const binaryArgs = [spectralCli, "lint", "contracts/*.yaml", "--fail-severity", "warn"];
const result = spawnSync(process.execPath, binaryArgs, {
  encoding: "utf8",
  shell: false,
});

const command = `${process.execPath} ${binaryArgs.join(" ")}`;
const stdout = result.stdout || "";
const stderr = result.stderr || (result.error ? result.error.message : "");
const output = [
  "FIT4110 Lab 03 - Contract lint report",
  `Command: ${command}`,
  `Generated at: ${new Date().toISOString()}`,
  `Exit code: ${result.status ?? 1}`,
  "",
  stdout.trim() || "No lint warnings or errors.",
  stderr.trim(),
]
  .filter(Boolean)
  .join("\n");

writeFileSync("reports/contract-lint-report.txt", `${output}\n`, "utf8");

if (result.status !== 0) {
  process.stdout.write(output);
  process.exit(result.status ?? 1);
}

process.stdout.write(output);

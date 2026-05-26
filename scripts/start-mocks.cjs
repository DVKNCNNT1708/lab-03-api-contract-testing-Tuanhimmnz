const { spawn } = require("child_process");

const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";
const children = [
  spawn(npmCmd, ["run", "mock:iot"], { stdio: "inherit" }),
  spawn(npmCmd, ["run", "mock:vision"], { stdio: "inherit" }),
];

function stopAll(signal) {
  for (const child of children) {
    if (!child.killed) child.kill(signal);
  }
}

for (const child of children) {
  child.on("exit", (code) => {
    if (code && code !== 0) {
      stopAll("SIGTERM");
      process.exitCode = code;
    }
  });
}

process.on("SIGINT", () => {
  stopAll("SIGINT");
  process.exit(130);
});

process.on("SIGTERM", () => {
  stopAll("SIGTERM");
  process.exit(143);
});

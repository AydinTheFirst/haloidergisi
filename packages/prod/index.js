import fs from "fs";
import path from "path";

// this script copies env file from root dir to app dirs
// this script is located at /packages/prod/index.js
const __dirname = path.resolve();
const rootDir = path.join(__dirname, "..", "..");

const envFile = path.join(rootDir, ".env");

const appDirs = [
  path.join(rootDir, "apps", "client"),
  path.join(rootDir, "apps", "server"),
];

appDirs.forEach((appDir) => {
  const targetEnvFile = path.join(appDir, ".env");
  if (fs.existsSync(targetEnvFile)) {
    fs.unlinkSync(targetEnvFile);
  }
  fs.copyFileSync(envFile, targetEnvFile);
});

console.log("Copied .env file to app directories.");

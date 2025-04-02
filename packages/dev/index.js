import fs from "node:fs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await sleep(1000 * 3);

// we are in packages/dev folder
const clientFolder = "../../apps/client";

// rename it to src/views
fs.renameSync(clientFolder + "/src/pages", clientFolder + "/src/views");

await sleep(1000 * 3);

// then rename it back to src/pages
fs.renameSync(clientFolder + "/src/views", clientFolder + "/src/pages");

console.log("Reloaded client folder");

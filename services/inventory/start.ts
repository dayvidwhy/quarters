import fs from "fs";
import { spawn } from "child_process";

let app = spawn("tsx", ["index.ts"], { stdio: "inherit" });

fs.watch("./", { recursive: true }, (eventType, filename) => {
    if (filename?.endsWith(".ts")) {
        console.log(`Event type: ${eventType}. Change detected in ${filename}`);
        app.kill();
        app = spawn("tsx", ["index.ts"], { stdio: "inherit" });
    }
});

import fs from "fs";
import { spawn } from "child_process";

let app = spawn("tsx", ["server.ts"]);

fs.watch("./", { recursive: true }, (eventType, filename) => {
    if (filename?.endsWith(".ts")) {
        console.log(`Event type: ${eventType}. Change detected in ${filename}`);
        app.kill();
        app = spawn("tsx", ["server.ts"]);
    }
});

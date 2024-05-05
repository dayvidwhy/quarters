#!/usr/bin/env node
import fs from "fs";
import { spawn } from "child_process";

/**
 * Spawn the app
 * @param command 
 * @param extension 
 * @returns 
 */
const spawnApp = (command: string) => {
    try {
        const commandArray = command.split(" ");
        return spawn(commandArray[0], commandArray.slice(1), { stdio: "inherit" });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

/**
 * Validate the arguments
 * @param args 
 */
const validateArguments = (args: string[]) => {
    if (args.length !== 2) {
        console.error("Usage: reload <command> <extensions>");
        process.exit(1);
    }
};

// Parse the arguments
const args = process.argv.slice(2);
validateArguments(args);

// Destructure the arguments
const [command, extension] = args;

// Start the app
let app = spawnApp(command);

// Watch for changes
fs.watch("./", { recursive: true }, (eventType, filename) => {
    if (filename?.endsWith(extension)) {
        console.log(`Event type: ${eventType}. Change detected in ${filename}`);
        app.kill();
        app = spawnApp(command);
    }
});

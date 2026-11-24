import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { applyWrites } from "./plan.js";
export async function runStep(project, step, options = {}) {
    if (step.kind === "write") {
        try {
            applyWrites(project, step.files ?? [], { keepExisting: step.keepExisting });
            return { ok: true, step, code: 0, output: "" };
        }
        catch (error) {
            return {
                ok: false,
                step,
                code: null,
                output: "",
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }
    if (step.kind === "verify") {
        const missing = ["prequelui/dialog/dialog.js", "prequelui-demo.html"].filter((file) => !fs.existsSync(path.join(project.root, file)));
        return {
            ok: missing.length === 0,
            step,
            code: missing.length === 0 ? 0 : 1,
            output: missing.length === 0 ? "files present" : `missing ${missing.join(", ")}`,
        };
    }
    if (!step.args || step.args.length === 0) {
        return { ok: false, step, code: null, output: "", error: "No command to run." };
    }
    return new Promise((resolve) => {
        const [command, ...args] = step.args;
        const env = { ...process.env, ...options.env, ...step.env, CI: "1" };
        // When this CLI is itself started through `npx --package <tarball>`, npm
        // exports npm_config_package. The nested `npx shadcn ...` would then run
        // the command inside our own tarball and fail with "shadcn@latest: not
        // found". Drop the npx execution hints so every nested command resolves
        // normally, the way it does after `npx prequelui-animate init`.
        for (const key of Object.keys(env)) {
            if (key.toLowerCase() === "npm_config_package" || key.toLowerCase() === "npm_config_call") {
                delete env[key];
            }
        }
        const child = spawn(command, args, {
            cwd: project.root,
            env,
            stdio: options.inherit ? "inherit" : ["ignore", "pipe", "pipe"],
            shell: false,
        });
        let stdout = "";
        let stderr = "";
        child.stdout?.on("data", (chunk) => {
            stdout += chunk.toString();
        });
        child.stderr?.on("data", (chunk) => {
            stderr += chunk.toString();
        });
        child.on("error", (error) => {
            resolve({
                ok: false,
                step,
                code: null,
                output: stdout,
                error: error.message,
            });
        });
        child.on("close", (code) => {
            const output = `${stdout}${stderr}`.trim();
            resolve({
                ok: code === 0,
                step,
                code,
                output,
                error: code === 0 ? undefined : tail(output),
            });
        });
    });
}
function tail(output, max = 2400) {
    if (output.length <= max)
        return output;
    return `…${output.slice(output.length - max)}`;
}
export function displayOutput(output, max = 14) {
    if (!output)
        return;
    const kept = [];
    let profiling = false;
    for (const line of output.split(/\r?\n/)) {
        const plainLine = line.replace(/\x1b\[[0-9;]*m/g, "");
        if (plainLine.includes("[PLUGIN_TIMINGS]")) {
            // Build tools sometimes dump profiling advice after a successful run.
            // It is useful in a CI log, not in a setup transcript.
            profiling = true;
            continue;
        }
        if (profiling) {
            if (plainLine.includes("rolldown.rs") || plainLine.includes("profile the build")) {
                profiling = false;
            }
            continue;
        }
        const clean = line.trim();
        if (!clean)
            continue;
        const plain = clean.replace(/\x1b\[[0-9;]*m/g, "");
        if (plain.includes("rolldown.rs") ||
            plain.includes("profile the build") ||
            /^-\s+plugin\s/.test(plain) ||
            /^\d+\s+callbacks?\b/.test(plain) ||
            /^dist\//.test(plain)) {
            continue;
        }
        kept.push(line.trimEnd());
    }
    for (const line of kept.slice(-max)) {
        process.stdout.write(`     ${line}\n`);
    }
}

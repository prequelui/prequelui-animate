import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BRIDGE = path.resolve(HERE, "..", "bin", "bridge.mjs");
const PORT = 4399;
const BASE = `http://127.0.0.1:${PORT}`;

function startBridge() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [BRIDGE, "--port", String(PORT)], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error("bridge did not start"));
    }, 4000);
    child.stdout.on("data", (chunk) => {
      output += String(chunk);
      const match = /Pairing code: (\d{6})/.exec(output);
      if (match) {
        clearTimeout(timer);
        resolve({ child, code: match[1] });
      }
    });
    child.stderr.on("data", (chunk) => {
      output += String(chunk);
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

async function json(response) {
  return response.json();
}

test("bridge pairs, queues, completes and cancels a request", async () => {
  const { child, code } = await startBridge();
  try {
    const health = await fetch(`${BASE}/v1/health`).then(json);
    assert.equal(health.ok, true);

    const pair = await fetch(`${BASE}/v1/pair`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost:3961" },
      body: JSON.stringify({ code }),
    }).then(json);
    assert.equal(typeof pair.token, "string");
    assert.ok(pair.token.length >= 32);

    const unauthorized = await fetch(`${BASE}/v1/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ framework: "react" }),
    });
    assert.equal(unauthorized.status, 401);

    const created = await fetch(`${BASE}/v1/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pair.token}`,
        Origin: "http://localhost:3961",
      },
      body: JSON.stringify({ framework: "react", recipe: { id: "press" } }),
    }).then(json);
    assert.match(created.id, /^req_/);

    const queued = await fetch(`${BASE}/v1/requests?status=queued`, {
      headers: { Authorization: `Bearer ${pair.token}` },
    }).then(json);
    assert.equal(queued.count, 1);
    assert.equal(queued.requests[0].id, created.id);

    const done = await fetch(`${BASE}/v1/requests/${created.id}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pair.token}`,
      },
      body: JSON.stringify({ summary: "Applied press", files: ["components/button.tsx"] }),
    }).then(json);
    assert.equal(done.status.state, "done");
    assert.deepEqual(done.status.files, ["components/button.tsx"]);

    const second = await fetch(`${BASE}/v1/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pair.token}`,
      },
      body: JSON.stringify({ framework: "react" }),
    }).then(json);
    const cancelled = await fetch(`${BASE}/v1/requests/${second.id}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pair.token}`,
      },
      body: JSON.stringify({ reason: "test" }),
    }).then(json);
    assert.equal(cancelled.status.state, "error");
  } finally {
    child.kill("SIGTERM");
  }
});

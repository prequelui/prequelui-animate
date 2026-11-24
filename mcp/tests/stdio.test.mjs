import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_SERVER = path.join(HERE, "..", "server.mjs");
const SERVER = path.resolve(process.argv[2] ?? process.env.PREQUELUI_MCP_SERVER ?? DEFAULT_SERVER);
const TIMEOUT_MS = Number(process.env.PREQUELUI_MCP_TEST_TIMEOUT ?? 120000);

function createClient(child) {
  const pending = new Map();
  let buffer = "";
  let finished = false;
  let failure = null;

  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    buffer += chunk;
    let newline = buffer.indexOf("\n");
    while (newline >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (line) handle(line);
      newline = buffer.indexOf("\n");
    }
  });

  function handle(line) {
    let message;
    try {
      message = JSON.parse(line);
    } catch {
      return;
    }
    if (message.id === undefined) return;
    const entry = pending.get(message.id);
    if (!entry) return;
    pending.delete(message.id);
    if (message.error) entry.reject(new Error(message.error.message ?? "JSON-RPC error"));
    else entry.resolve(message.result);
  }

  child.on("exit", (code) => {
    finished = true;
    const error = failure ?? new Error(`MCP server exited with code ${code}`);
    for (const entry of pending.values()) entry.reject(error);
    pending.clear();
  });

  function send(payload) {
    child.stdin.write(`${JSON.stringify(payload)}\n`);
  }

  function request(id, method, params) {
    if (finished) return Promise.reject(failure ?? new Error("MCP server is not running"));
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      send({ jsonrpc: "2.0", id, method, params });
    });
  }

  function notify(method, params) {
    send({ jsonrpc: "2.0", method, params });
  }

  return { request, notify, fail: (error) => { failure = error; } };
}

async function main() {
  const child = spawn(process.execPath, [SERVER], {
    stdio: ["pipe", "pipe", "pipe"],
    env: process.env,
  });

  const client = createClient(child);
  const stderr = [];
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk) => {
    stderr.push(chunk);
    if (process.env.PREQUELUI_MCP_DEBUG) process.stderr.write(`[prequelui-mcp] ${chunk}`);
  });

  const timer = setTimeout(() => {
    client.fail(new Error(`MCP session timed out after ${TIMEOUT_MS} ms`));
    child.kill("SIGKILL");
  }, TIMEOUT_MS);
  timer.unref?.();

  try {
    const init = await client.request(1, "initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "prequelui-pack-test", version: "1.0.0" },
    });
    assert.equal(init.serverInfo?.name, "prequelui");
    assert.ok(init.capabilities?.tools, "server must advertise tools");

    client.notify("notifications/initialized", {});

    const tools = await client.request(2, "tools/list", {});
    const names = (tools.tools ?? []).map((tool) => tool.name).sort();
    assert.deepEqual(names, [
      "describe_component",
      "get_install_command",
      "search_components",
      "suggest_components",
    ]);

    const search = await client.request(3, "tools/call", {
      name: "search_components",
      arguments: { query: "accordion", limit: 3 },
    });
    assert.equal(search.isError, undefined);
    const value = JSON.parse(search.content[0].text);
    assert.ok(value.count > 0, "expected at least one result");
    assert.equal(value.results[0].name, "accordion");
    assert.match(value.results[0].install, /\/r\/react\/accordion\.json$/);
    assert.match(value.results[0].docsUrl, /\/docs\/primitives\/base-ui\/accordion$/);

    const install = await client.request(4, "tools/call", {
      name: "get_install_command",
      arguments: { name: "accordion", framework: "vue" },
    });
    const installValue = JSON.parse(install.content[0].text);
    assert.equal(installValue.available, true);
    assert.match(installValue.command, /shadcn-vue@latest add .*\/r\/vue\/accordion\.json$/);

    process.stderr.write(
      `stdio ok: ${value.count} search result(s), ${names.length} tools, server ${init.serverInfo.version}\n`,
    );
  } finally {
    clearTimeout(timer);
    child.stdin.end();
    child.kill("SIGTERM");
    await new Promise((resolve) => {
      if (child.exitCode !== null) resolve();
      else child.once("exit", resolve);
    });
    if (stderr.length && process.env.PREQUELUI_MCP_DEBUG) process.stderr.write(stderr.join(""));
  }
}

main().catch((error) => {
  process.stderr.write(`stdio test failed: ${error?.stack ?? error}\n`);
  process.exit(1);
});

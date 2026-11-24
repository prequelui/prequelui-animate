import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

function config() {
  const url = (process.env.PREQUELUI_BOT_BRIDGE ?? "").replace(/\/+$/, "");
  let token = process.env.PREQUELUI_BOT_TOKEN ?? "";
  if (!token) {
    try {
      token = readFileSync(path.join(homedir(), ".prequelui-bot-token"), "utf8").trim();
    } catch {
      token = "";
    }
  }
  return { url, token };
}

async function call(route, options = {}) {
  const { url, token } = config();
  if (!url) throw new Error("PREQUELUI_BOT_BRIDGE is not set.");
  if (!token) throw new Error("No bot token. Pair the overlay first, then restart the MCP server.");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(`${url}${route}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers ?? {}),
      },
    });
    if (!response.ok) throw new Error(`Bridge responded with ${response.status}.`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function getBotRequest(args = {}) {
  if (args.id) {
    return call(`/v1/requests/${encodeURIComponent(args.id)}`);
  }
  const queued = await call("/v1/requests?status=queued");
  if (!queued.count) {
    return { count: 0, request: null, message: "No queued request. Ask the user to send one from the PrequelUI bot overlay." };
  }
  return { count: queued.count, request: queued.requests[0] };
}

export async function completeBotRequest(args = {}) {
  const id = String(args.id ?? "").trim();
  if (!id) throw new Error("id is required.");
  const body = {
    summary: String(args.summary ?? "Applied."),
    files: Array.isArray(args.files) ? args.files.map(String) : [],
    diff: typeof args.diff === "string" ? args.diff : undefined,
  };
  return call(`/v1/requests/${encodeURIComponent(id)}/complete`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function cancelBotRequest(args = {}) {
  const id = String(args.id ?? "").trim();
  if (!id) throw new Error("id is required.");
  return call(`/v1/requests/${encodeURIComponent(id)}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason: args.reason ?? "cancelled by the agent" }),
  });
}

export async function botInbox() {
  const queued = await call("/v1/requests?status=queued");
  const done = await call("/v1/requests?status=done");
  return {
    queued: queued.requests ?? [],
    recent: (done.requests ?? []).slice(0, 10),
  };
}

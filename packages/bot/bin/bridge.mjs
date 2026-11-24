#!/usr/bin/env node
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { createServer } from "node:http";

const VERSION = "2.0.0";
const args = process.argv.slice(2);
const portArg = args.indexOf("--port");
const PORT = Number(portArg >= 0 ? args[portArg + 1] : process.env.PREQUELUI_BOT_PORT || 4318);
const HOST = "127.0.0.1";
const MAX_BODY = 32 * 1024;
const RATE_WINDOW = 60_000;
const RATE_MAX = 30;

const pairingCode = String(Math.floor(100000 + Math.random() * 900000));
const pairingExpires = Date.now() + 10 * 60 * 1000;
let pairingAttempts = 0;
const tokens = new Map();
const requests = new Map();
const sockets = new Map();
const hits = new Map();

if (!Number.isFinite(PORT) || PORT < 1024 || PORT > 65535) {
  console.error("Invalid port");
  process.exit(1);
}

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
    "Cache-Control": "no-store",
  });
  res.end(payload);
}

function cors(origin) {
  const allowed =
    !origin ||
    /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin) ||
    /^https?:\/\/[^/]+\.local(:\d+)?$/.test(origin);
  return {
    "Access-Control-Allow-Origin": allowed && origin ? origin : "http://localhost",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Vary": "Origin",
  };
}

function auth(req) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const session = tokens.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    tokens.delete(token);
    return null;
  }
  return { token, ...session };
}

function safeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function rate(ip) {
  const now = Date.now();
  const entry = hits.get(ip) ?? { start: now, count: 0 };
  if (now - entry.start > RATE_WINDOW) {
    entry.start = now;
    entry.count = 0;
  }
  entry.count += 1;
  hits.set(ip, entry);
  return entry.count <= RATE_MAX;
}

function broadcast(id) {
  const client = sockets.get(id);
  if (!client) return;
  const request = requests.get(id);
  if (!request) return;
  sendFrame(client, JSON.stringify({ id, ...request.status }));
}

function sendFrame(socket, text) {
  try {
    const payload = Buffer.from(text);
    const length = payload.length;
    let header;
    if (length < 126) {
      header = Buffer.from([0x81, length]);
    } else if (length < 65536) {
      header = Buffer.alloc(4);
      header[0] = 0x81;
      header[1] = 126;
      header.writeUInt16BE(length, 2);
    } else {
      header = Buffer.alloc(10);
      header[0] = 0x81;
      header[1] = 127;
      header.writeBigUInt64BE(BigInt(length), 2);
    }
    socket.write(Buffer.concat([header, payload]));
  } catch {}
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error("body-too-large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function makeId() {
  return `req_${randomBytes(4).toString("hex")}`;
}

function completed(req) {
  return {
    id: req.id,
    request: req.request,
    status: req.status,
  };
}

const server = createServer(async (req, res) => {
  const origin = req.headers.origin;
  for (const [key, value] of Object.entries(cors(origin))) res.setHeader(key, value);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const ip = req.socket.remoteAddress ?? "127.0.0.1";
  if (!rate(ip)) {
    json(res, 429, { error: "rate-limited" });
    return;
  }

  let url;
  try {
    url = new URL(req.url ?? "/", `http://${HOST}:${PORT}`);
  } catch {
    json(res, 400, { error: "bad-url" });
    return;
  }
  const path = url.pathname;

  if (req.method === "GET" && path === "/v1/health") {
    json(res, 200, {
      ok: true,
      version: VERSION,
      queued: Array.from(requests.values()).filter((item) => item.status.state === "queued").length,
      paired: tokens.size > 0,
    });
    return;
  }

  if (req.method === "POST" && path === "/v1/pair") {
    if (Date.now() > pairingExpires || pairingAttempts >= 5) {
      json(res, 410, { error: "pairing-expired" });
      return;
    }
    if (req.headers["content-type"] !== "application/json") {
      json(res, 415, { error: "content-type" });
      return;
    }
    try {
      const body = JSON.parse(await readBody(req));
      if (!safeEqual(String(body.code ?? ""), pairingCode)) {
        pairingAttempts += 1;
        json(res, 401, { error: "bad-code", attemptsLeft: Math.max(0, 5 - pairingAttempts) });
        return;
      }
      const token = randomBytes(32).toString("hex");
      const expiresAt = Date.now() + 15 * 60 * 1000;
      tokens.set(token, { expiresAt, origin: origin ?? "http://localhost" });
      try {
        writeFileSync(path.join(homedir(), ".prequelui-bot-token"), token, { mode: 0o600 });
      } catch {}
      json(res, 200, { token, expiresAt, origin: origin ?? "http://localhost" });
    } catch {
      json(res, 400, { error: "bad-body" });
    }
    return;
  }

  const session = auth(req);

  if (req.method === "POST" && path === "/v1/requests") {
    if (!session) {
      json(res, 401, { error: "unauthorized" });
      return;
    }
    if (req.headers["content-type"] !== "application/json") {
      json(res, 415, { error: "content-type" });
      return;
    }
    try {
      const body = JSON.parse(await readBody(req));
      const id = makeId();
      const entry = {
        id,
        createdAt: new Date().toISOString(),
        request: body,
        status: { state: "queued" },
      };
      requests.set(id, entry);
      broadcast(id);
      json(res, 201, { id, status: entry.status });
    } catch (error) {
      json(res, error instanceof Error && error.message === "body-too-large" ? 413 : 400, {
        error: "bad-body",
      });
    }
    return;
  }

  if (req.method === "GET" && path === "/v1/requests") {
    if (!session) {
      json(res, 401, { error: "unauthorized" });
      return;
    }
    const state = url.searchParams.get("status") ?? "queued";
    const list = Array.from(requests.values())
      .filter((item) => item.status.state === state)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .slice(0, 10)
      .map(completed);
    json(res, 200, { count: list.length, requests: list });
    return;
  }

  const match = /^\/v1\/requests\/([A-Za-z0-9_-]+)(?:\/(complete|cancel))?$/.exec(path);
  if (match) {
    if (!session) {
      json(res, 401, { error: "unauthorized" });
      return;
    }
    const id = match[1];
    const action = match[2];
    const entry = requests.get(id);
    if (!entry) {
      json(res, 404, { error: "not-found" });
      return;
    }
    if (req.method === "GET" && !action) {
      json(res, 200, completed(entry));
      return;
    }
    if (req.method === "DELETE" && !action) {
      entry.status = { state: "error", error: "cancelled" };
      broadcast(id);
      json(res, 200, { ok: true });
      return;
    }
    if (req.method === "POST" && action) {
      try {
        const body = JSON.parse(await readBody(req));
        if (action === "complete") {
          entry.status = {
            state: "done",
            summary: String(body.summary ?? "Done"),
            files: Array.isArray(body.files) ? body.files.map(String) : [],
          };
        } else {
          entry.status = { state: "error", error: String(body.reason ?? "cancelled") };
        }
        broadcast(id);
        json(res, 200, { ok: true, status: entry.status });
      } catch {
        json(res, 400, { error: "bad-body" });
      }
      return;
    }
  }

  json(res, 404, { error: "not-found" });
});

server.on("upgrade", (req, socket) => {
  let url;
  try {
    url = new URL(req.url ?? "/", `http://${HOST}:${PORT}`);
  } catch {
    socket.destroy();
    return;
  }
  if (url.pathname !== "/v1/events") {
    socket.destroy();
    return;
  }
  const token = url.searchParams.get("token") ?? "";
  const session = tokens.get(token);
  if (!session || session.expiresAt < Date.now()) {
    socket.destroy();
    return;
  }
  const id = url.searchParams.get("request") ?? "";
  const key = req.headers["sec-websocket-key"];
  if (!key) {
    socket.destroy();
    return;
  }
  const accept = createHash("sha1")
    .update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
    .digest("base64");
  socket.write(
    "HTTP/1.1 101 Switching Protocols\r\n" +
      "Upgrade: websocket\r\n" +
      "Connection: Upgrade\r\n" +
      `Sec-WebSocket-Accept: ${accept}\r\n\r\n`,
  );
  sockets.set(id, socket);
  const entry = requests.get(id);
  if (entry) sendFrame(socket, JSON.stringify({ id, ...entry.status }));
  socket.on("close", () => sockets.delete(id));
  socket.on("error", () => sockets.delete(id));
});

server.listen(PORT, HOST, () => {
  const minutes = Math.max(0, Math.floor((pairingExpires - Date.now()) / 60000));
  const seconds = Math.max(0, Math.floor(((pairingExpires - Date.now()) % 60000) / 1000));
  console.log("PrequelUI Bot bridge");
  console.log(`Local only · ${HOST}:${PORT}`);
  console.log(`Pairing code: ${pairingCode} (expires in ${minutes}:${String(seconds).padStart(2, "0")})`);
  console.log("After pairing, the MCP token is written to ~/.prequelui-bot-token (mode 600).");
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}

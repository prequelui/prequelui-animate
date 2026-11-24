import type {
  BridgeConfig,
  BridgeRequest,
  BridgeSession,
  BridgeStatus,
  Framework,
  Recipe,
  RecipeOptions,
  TargetSnapshot,
} from "../types";
import { installFor } from "../output/install";

const TIMEOUT = 3000;

async function withTimeout(input: RequestInfo, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

export class BridgeClient {
  private config: BridgeConfig;
  private session: BridgeSession | null = null;
  private socket: WebSocket | null = null;

  constructor(config: BridgeConfig) {
    this.config = config;
  }

  useToken(token: string, origin = "127.0.0.1") {
    this.session = { token, expiresAt: Date.now() + 15 * 60 * 1000, origin };
  }

  get connected(): boolean {
    return Boolean(this.session && this.session.expiresAt > Date.now());
  }

  get label(): string {
    if (!this.session) return "No local bridge";
    const remaining = Math.max(0, this.session.expiresAt - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    const token = this.config.token ? "token ••••" : "paired";
    return `Local bridge · ${this.session.origin} · ${token} · expires in ${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  async pair(code: string): Promise<BridgeSession> {
    const response = await withTimeout(`${this.config.url.replace(/\/+$/, "")}/v1/pair`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (!response.ok) throw new Error("pairing-failed");
    const session = (await response.json()) as BridgeSession;
    this.session = session;
    this.config.token = session.token;
    return session;
  }

  async send(request: BridgeRequest): Promise<string> {
    if (!this.session) throw new Error("not-paired");
    const response = await withTimeout(`${this.config.url.replace(/\/+$/, "")}/v1/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.session.token}`,
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error("send-failed");
    const body = (await response.json()) as { id?: string };
    return body.id ?? request.id;
  }

  async status(id: string): Promise<BridgeStatus> {
    if (!this.session) throw new Error("not-paired");
    const response = await withTimeout(
      `${this.config.url.replace(/\/+$/, "")}/v1/requests/${encodeURIComponent(id)}`,
      {
        headers: { Authorization: `Bearer ${this.session.token}` },
      },
    );
    if (!response.ok) throw new Error("status-failed");
    return (await response.json()) as BridgeStatus;
  }

  async cancel(id: string): Promise<void> {
    if (!this.session) return;
    await withTimeout(`${this.config.url.replace(/\/+$/, "")}/v1/requests/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.session.token}` },
    });
  }

  subscribe(id: string, onStatus: (status: BridgeStatus) => void): () => void {
    if (!this.session) return () => {};
    try {
      const url = new URL(this.config.url);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
      url.pathname = "/v1/events";
      url.searchParams.set("request", id);
      url.searchParams.set("token", this.session.token);
      this.socket = new WebSocket(url.toString());
      this.socket.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(String(event.data)) as BridgeStatus & { id?: string };
          if (!data.id || data.id === id) onStatus(data);
        } catch {}
      });
    } catch {
      return () => {};
    }
    const poll = window.setInterval(() => {
      void this.status(id)
        .then((status) => {
          onStatus(status);
          if (status.state === "done" || status.state === "error") {
            window.clearInterval(poll);
          }
        })
        .catch(() => {});
    }, 2500);
    return () => {
      window.clearInterval(poll);
      try {
        this.socket?.close();
      } catch {}
      this.socket = null;
    };
  }

  destroy() {
    try {
      this.socket?.close();
    } catch {}
    this.socket = null;
    this.session = null;
  }
}

export function makeBridgeRequest(
  id: string,
  recipe: Recipe,
  options: RecipeOptions,
  target: TargetSnapshot,
  framework: Framework,
  instructions: string,
): BridgeRequest {
  const install = installFor(recipe, framework);
  return {
    id,
    createdAt: new Date().toISOString(),
    framework,
    target: {
      kind: target.kind,
      tag: target.tag,
      text: target.text,
      box: { w: target.box.w, h: target.box.h },
      path: target.path,
    },
    recipe: {
      id: recipe.id,
      registry: recipe.registry,
      properties: recipe.properties,
      defaults: recipe.defaults,
    },
    options,
    install: install.command,
    docsUrl: install.docsUrl,
    instructions,
  };
}

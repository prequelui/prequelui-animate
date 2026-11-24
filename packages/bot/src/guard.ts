import type { BotConfig } from "./types";

export type GuardResult = {
  enabled: boolean;
  reason: "ok" | "host" | "flag" | "prod";
  message?: string;
};

function normalizeHost(host: string): string {
  return host.trim().toLowerCase().replace(/^\[|\]$/g, "");
}

function isPrivateHost(host: string): boolean {
  if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "0.0.0.0") {
    return true;
  }
  if (host.endsWith(".local") || host.endsWith(".localhost")) return true;
  if (host.endsWith(".internal")) return true;
  const v4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])];
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
  }
  return host.includes(".local:");
}

function hostAllowed(location: Location, allowHosts: string[]): boolean {
  const host = normalizeHost(location.hostname);
  if (isPrivateHost(host)) return true;
  return allowHosts.some((allowed) => {
    const value = normalizeHost(allowed);
    if (!value) return false;
    if (value.startsWith("*.")) {
      return host === value.slice(2) || host.endsWith(value.slice(1));
    }
    return host === value || host.endsWith("." + value);
  });
}

export function checkEnvironment(
  config: BotConfig,
  options: { script: HTMLScriptElement | null; requireDevAttribute: boolean },
): GuardResult {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return { enabled: false, reason: "prod" };
  }
  if (config.disabled || window.__PREQUEL_BOT_DISABLED__) {
    return { enabled: false, reason: "flag" };
  }
  try {
    const meta = document.querySelector('meta[name="prequel-bot"]');
    if (meta && meta.getAttribute("content") === "off") {
      return { enabled: false, reason: "flag" };
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get("prequel") === "off") {
      return { enabled: false, reason: "flag" };
    }
  } catch {}

  if (options.requireDevAttribute) {
    const flag = options.script?.dataset.prequelBot;
    if (flag !== "dev") return { enabled: false, reason: "flag" };
  }

  if (config.force) {
    if (config.demo && config.scope) {
      return { enabled: true, reason: "ok", message: "Demo scope" };
    }
    if (hostAllowed(window.location, config.allowHosts)) {
      return { enabled: true, reason: "ok", message: "Not for production" };
    }
    return { enabled: false, reason: "host" };
  }

  let protocol = "https:";
  try {
    protocol = window.location.protocol;
  } catch {}
  if (protocol === "file:") {
    return { enabled: false, reason: "host" };
  }
  if (!hostAllowed(window.location, config.allowHosts)) {
    return { enabled: false, reason: "host" };
  }
  return { enabled: true, reason: "ok" };
}

export function disable(reason: "host" | "flag" | "prod"): void {
  try {
    window.__PREQUEL_BOT_DISABLED__ = reason;
    console.info("[prequel-bot] disabled outside development");
  } catch {}
}

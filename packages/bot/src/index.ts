import { BotApp } from "./app";
import { DEFAULT_CONFIG, mergeConfig, readScriptConfig } from "./config";
import { checkEnvironment, disable } from "./guard";
import type { BotConfig, PrequelBotHandle } from "./types";
import { version as botVersion } from "./version";

export type {
  ApplyPayload,
  BotConfig,
  BotState,
  BridgeConfig,
  ExistingMotion,
  Framework,
  MascotState,
  Position,
  PrequelBotHandle,
  Proposal,
  ProposalSet,
  Recipe,
  RecipeOptions,
  TargetKind,
  TargetSnapshot,
} from "./types";
export { DEFAULT_CONFIG, mergeConfig, readScriptConfig } from "./config";
export { version } from "./version";
export { takeSnapshot } from "./analyze/snapshot";
export { classifySignals, scoreSignals, confidenceLabel } from "./analyze/classify";
export { propose } from "./recipes/proposal";
export { RECIPES, getRecipe } from "./recipes/catalog";
export { generateCode } from "./output/code";
export { installFor } from "./output/install";
export { PreviewSession } from "./preview/session";
export { keyframesFor, timingFor } from "./preview/keyframes";
export { BridgeClient, makeBridgeRequest } from "./bridge/client";

let instance: BotApp | null = null;

function scopeElement(selector: string | null): HTMLElement | null {
  if (!selector) return null;
  try {
    const node = document.querySelector(selector);
    return node instanceof HTMLElement ? node : null;
  } catch {
    return null;
  }
}

export function mountPrequelBot(
  target: HTMLElement = document.body,
  config?: Partial<BotConfig>,
): PrequelBotHandle | null {
  if (typeof document === "undefined") return null;
  const connected = document.getElementById("prequel-bot-root");
  if (connected) {
    if (window.__PREQUEL_BOT__) return window.__PREQUEL_BOT__;
    if (instance) return instance;
  }
  instance = null;
  const script = (document.currentScript as HTMLScriptElement | null) ?? null;
  const merged = mergeConfig(readScriptConfig(script), config ?? null);
  const guard = checkEnvironment(merged, { script, requireDevAttribute: false });
  if (!guard.enabled) {
    disable(guard.reason === "ok" ? "flag" : guard.reason);
    return null;
  }
  if (merged.demo && merged.force && !scopeElement(merged.scope)) {
    return null;
  }
  instance = new BotApp(target, merged);
  return instance;
}

export function mountFromScript(script: HTMLScriptElement | null): PrequelBotHandle | null {
  if (typeof document === "undefined") return null;
  const config = mergeConfig(DEFAULT_CONFIG, readScriptConfig(script));
  const guard = checkEnvironment(config, { script, requireDevAttribute: true });
  if (!guard.enabled) {
    disable(guard.reason === "ok" ? "flag" : guard.reason);
    return null;
  }
  const start = () => {
    mountPrequelBot(document.body, config);
  };
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(start, { timeout: 1200 });
  } else {
    window.setTimeout(start, 400);
  }
  return null;
}

export default mountPrequelBot;
export const currentVersion = botVersion;

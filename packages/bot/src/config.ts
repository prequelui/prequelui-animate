import type {
  BotConfig,
  Framework,
  Position,
  ReducedMotionPolicy,
} from "./types";

const POSITIONS: Position[] = ["br", "bl", "tr", "tl"];
const FRAMEWORKS: Framework[] = ["react", "vue", "svelte", "solid", "vanilla"];

export const DEFAULT_CONFIG: BotConfig = {
  position: "br",
  size: 64,
  label: "PrequelUI Bot",
  showLabel: true,
  framework: "react",
  allowHosts: [],
  registryUrl: null,
  hotkey: "Alt+Shift+A",
  bridge: false,
  reducedMotion: "system",
  disabled: false,
  force: false,
  demo: false,
  scope: null,
};

function asPosition(value: unknown): Position | null {
  return typeof value === "string" && POSITIONS.includes(value as Position)
    ? (value as Position)
    : null;
}

function asFramework(value: unknown): Framework | null {
  return typeof value === "string" && FRAMEWORKS.includes(value as Framework)
    ? (value as Framework)
    : null;
}

function asReduced(value: unknown): ReducedMotionPolicy | null {
  return value === "system" || value === "always" || value === "never" ? value : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function asBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "1" || value === "") return true;
  if (value === "false" || value === "0") return false;
  return null;
}

function definedOnly(value: Partial<BotConfig> | null | undefined): Partial<BotConfig> {
  if (!value) return {};
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as Partial<BotConfig>;
}

export function mergeConfig(
  base: Partial<BotConfig> | null | undefined,
  overrides: Partial<BotConfig> | null | undefined,
): BotConfig {
  const config: BotConfig = {
    ...DEFAULT_CONFIG,
    ...definedOnly(base),
    ...definedOnly(overrides),
  };
  config.position = asPosition(config.position) ?? DEFAULT_CONFIG.position;
  config.framework = asFramework(config.framework) ?? DEFAULT_CONFIG.framework;
  config.reducedMotion = asReduced(config.reducedMotion) ?? DEFAULT_CONFIG.reducedMotion;
  config.size = Math.min(160, Math.max(32, asNumber(config.size) ?? DEFAULT_CONFIG.size));
  config.showLabel = config.showLabel !== false;
  config.allowHosts = Array.isArray(config.allowHosts)
    ? config.allowHosts.filter((host): host is string => typeof host === "string")
    : [];
  config.label = typeof config.label === "string" ? config.label : null;
  config.scope = typeof config.scope === "string" && config.scope.trim() ? config.scope.trim() : null;
  config.demo = config.demo === true;
  config.force = config.force === true;
  config.disabled = config.disabled === true;
  return config;
}

export function readScriptConfig(script: HTMLScriptElement | null): BotConfig {
  if (!script) return { ...DEFAULT_CONFIG };
  const dataset = script.dataset;
  let fromJson: Partial<BotConfig> = {};
  if (dataset.config) {
    try {
      const parsed = JSON.parse(dataset.config) as Record<string, unknown>;
      if (parsed && typeof parsed === "object") {
        fromJson = {
          position: asPosition(parsed.position) ?? undefined,
          size: asNumber(parsed.size) ?? undefined,
          label:
            parsed.label === null
              ? null
              : typeof parsed.label === "string"
                ? parsed.label
                : undefined,
          showLabel: asBoolean(parsed.showLabel) ?? undefined,
          framework: asFramework(parsed.framework) ?? undefined,
          allowHosts: Array.isArray(parsed.allowHosts)
            ? parsed.allowHosts.filter((host): host is string => typeof host === "string")
            : undefined,
          registryUrl:
            typeof parsed.registryUrl === "string" ? parsed.registryUrl : undefined,
          hotkey:
            parsed.hotkey === false
              ? false
              : typeof parsed.hotkey === "string"
                ? parsed.hotkey
                : undefined,
          reducedMotion: asReduced(parsed.reducedMotion) ?? undefined,
          disabled: asBoolean(parsed.disabled) ?? undefined,
          force: asBoolean(parsed.force) ?? undefined,
          demo: asBoolean(parsed.demo) ?? undefined,
          scope: typeof parsed.scope === "string" ? parsed.scope : undefined,
        };
      }
    } catch {
      fromJson = {};
    }
  }

  const hosts = dataset.hosts
    ? dataset.hosts
        .split(",")
        .map((host) => host.trim())
        .filter(Boolean)
    : undefined;

  const overrides: Partial<BotConfig> = {
    position: asPosition(dataset.position) ?? fromJson.position,
    size: asNumber(dataset.size) ?? fromJson.size,
    label:
      dataset.label === undefined
        ? fromJson.label
        : dataset.label === "none"
          ? null
          : dataset.label,
    framework: asFramework(dataset.framework) ?? fromJson.framework,
    allowHosts: hosts ?? fromJson.allowHosts,
    registryUrl: dataset.registryUrl ?? fromJson.registryUrl,
    hotkey:
      dataset.hotkey === undefined
        ? fromJson.hotkey
        : dataset.hotkey === "false"
          ? false
          : dataset.hotkey,
    reducedMotion: asReduced(dataset.reducedMotion) ?? fromJson.reducedMotion,
    disabled: asBoolean(dataset.disabled) ?? fromJson.disabled,
    force: asBoolean(dataset.force) ?? fromJson.force,
    demo: asBoolean(dataset.demo) ?? fromJson.demo,
    scope: dataset.scope ?? fromJson.scope,
  };

  return mergeConfig(DEFAULT_CONFIG, overrides);
}

const PREFIX = "prequel-bot:";

export function storageGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function storageSet(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(PREFIX + key, value);
  } catch {}
}

export function readPosition(fallback: Position): Position {
  return asPosition(storageGet("position")) ?? fallback;
}

export function writePosition(position: Position): void {
  storageSet("position", position);
}

export function readFramework(fallback: Framework): Framework {
  return asFramework(storageGet("framework")) ?? fallback;
}

export function writeFramework(framework: Framework): void {
  storageSet("framework", framework);
}

export function readLastRecipe(kind: string): string | null {
  const raw = storageGet("last-recipe");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    return typeof parsed[kind] === "string" ? parsed[kind] : null;
  } catch {
    return null;
  }
}

export function writeLastRecipe(kind: string, recipe: string): void {
  let parsed: Record<string, string> = {};
  const raw = storageGet("last-recipe");
  if (raw) {
    try {
      parsed = JSON.parse(raw) as Record<string, string>;
    } catch {
      parsed = {};
    }
  }
  parsed[kind] = recipe;
  storageSet("last-recipe", JSON.stringify(parsed));
}

export function resolveReduced(policy: ReducedMotionPolicy): boolean {
  if (policy === "always") return true;
  if (policy === "never") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export function watchReduced(callback: (reduced: boolean) => void): () => void {
  let media: MediaQueryList | null = null;
  try {
    media = window.matchMedia("(prefers-reduced-motion: reduce)");
  } catch {
    return () => {};
  }
  const handler = (event: MediaQueryListEvent) => callback(event.matches);
  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", handler);
    return () => media?.removeEventListener("change", handler);
  }
  return () => {};
}

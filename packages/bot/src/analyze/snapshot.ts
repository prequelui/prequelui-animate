import type {
  ExistingMotion,
  TargetKind,
  TargetSignals,
  TargetSnapshot,
} from "../types";
import { classifySignals } from "./classify";

const SENSITIVE_SELECTOR = [
  'input[type="password"]',
  'input[type="hidden"]',
  'input[type="file"]',
  "[autocomplete^='cc-']",
  '[autocomplete="current-password"]',
  '[autocomplete="new-password"]',
  "[data-prequel-sensitive]",
].join(",");

const INLINE_TAGS = new Set(["SPAN", "B", "I", "EM", "STRONG", "BR", "SMALL", "MARK", "U", "S"]);

const SKIP_TEXT_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEMPLATE",
  "SVG",
  "VIDEO",
  "AUDIO",
]);

export function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") return CSS.escape(value);
  return value.replace(/[^a-zA-Z0-9_-]/g, (char) => "\\" + char);
}

function px(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isStableId(id: string): boolean {
  if (!id || id.startsWith(":r") || id.includes(":")) return false;
  if (id.length > 48) return false;
  if (/^\d/.test(id)) return false;
  if (/^(radix|headlessui|downshift|react-select|mui)-?\d+/i.test(id)) return false;
  return true;
}

function isStableClass(token: string): boolean {
  if (!token || token.length > 40) return false;
  if (token.includes(":") || token.includes("[")) return false;
  if (/^css-[a-z0-9]+$/i.test(token)) return false;
  if (/^_?[a-z]{1,2}[a-z0-9]{6,}$/i.test(token) && /\d/.test(token)) return false;
  if (/^sc-[a-zA-Z0-9]+$/.test(token)) return false;
  return /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(token);
}

export function buildSelector(el: Element): string {
  const slot = el.getAttribute("data-slot");
  if (slot) return `[data-slot="${slot.replace(/"/g, '\\"')}"]`;
  const id = el.id;
  if (isStableId(id)) return `#${cssEscape(id)}`;
  const testId = el.getAttribute("data-testid");
  if (testId) return `[data-testid="${testId.replace(/"/g, '\\"')}"]`;

  const parts: string[] = [];
  let current: Element | null = el;
  let depth = 0;
  while (current && depth < 6 && current !== document.documentElement) {
    const tag = current.tagName.toLowerCase();
    let piece = tag;
    if (current.id && isStableId(current.id)) {
      piece = `#${cssEscape(current.id)}`;
      parts.unshift(piece);
      break;
    }
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (sibling) => sibling.tagName === current!.tagName,
      );
      if (siblings.length > 1) {
        piece += `:nth-of-type(${siblings.indexOf(current) + 1})`;
      }
    }
    parts.unshift(piece);
    current = current.parentElement;
    depth += 1;
  }
  return parts.join(" > ");
}

export function buildPath(el: Element): string[] {
  const path: string[] = [];
  let current: Element | null = el;
  while (current && current !== document.documentElement && path.length < 8) {
    let piece = current.tagName.toLowerCase();
    if (current.id && isStableId(current.id)) {
      piece += `#${current.id}`;
    } else {
      const stable = Array.from(current.classList).find(isStableClass);
      if (stable) piece += `.${stable}`;
    }
    path.unshift(piece);
    current = current.parentElement;
  }
  return path;
}

function isSensitive(el: Element): boolean {
  try {
    if (el.matches(SENSITIVE_SELECTOR)) return true;
    return Boolean(el.querySelector(SENSITIVE_SELECTOR));
  } catch {
    return false;
  }
}

function rawText(el: Element): string {
  if (el instanceof HTMLInputElement) {
    return (el.getAttribute("aria-label") ?? el.placeholder ?? "").trim();
  }
  if (el instanceof HTMLTextAreaElement) {
    return (el.getAttribute("aria-label") ?? el.placeholder ?? "").trim();
  }
  if (el instanceof HTMLSelectElement) {
    return (el.getAttribute("aria-label") ?? "").trim();
  }
  if (el instanceof HTMLImageElement) {
    return (el.alt ?? "").trim();
  }
  if (el.getAttribute("contenteditable") === "true") return "";
  const clone = el.cloneNode(true) as Element;
  for (const node of Array.from(clone.querySelectorAll(Array.from(SKIP_TEXT_TAGS).join(",")))) {
    node.remove();
  }
  return (clone.textContent ?? "").replace(/\s+/g, " ").trim();
}

const MOTION_PROPERTIES = [
  "all",
  "transform",
  "translate",
  "scale",
  "rotate",
  "opacity",
  "filter",
  "width",
  "height",
  "margin",
  "padding",
  "inset",
  "top",
  "left",
  "right",
  "bottom",
  "clip-path",
  "background-size",
  "background-position",
  "mask-image",
  "box-shadow",
  "max-height",
  "grid-template-rows",
];

function movesProperty(property: string): boolean {
  const value = property.trim().toLowerCase();
  if (!value) return false;
  return (
    MOTION_PROPERTIES.includes(value) ||
    MOTION_PROPERTIES.some(
      (motion) => motion !== "all" && value.includes(motion),
    )
  );
}

function animationMoves(animation: Animation): boolean {
  const transition = (animation as Animation & { transitionProperty?: string })
    .transitionProperty;
  if (transition) return movesProperty(transition);
  const effect = animation.effect as KeyframeEffect | null;
  if (!effect || typeof effect.getKeyframes !== "function") return true;
  const frames = effect.getKeyframes();
  return frames.some((frame) =>
    Object.keys(frame).some((key) =>
      ["transform", "opacity", "filter", "translate", "scale", "rotate", "clipPath", "backgroundSize", "backgroundPosition", "boxShadow", "maskImage"].includes(key),
    ),
  );
}

function existingMotion(el: Element): ExistingMotion {
  try {
    if (typeof el.getAnimations === "function") {
      const running = el.getAnimations().filter(animationMoves);
      if (running.length > 0) return "waapi";
    }
    const style = getComputedStyle(el);
    if (style.animationName && style.animationName !== "none") return "css-animation";
    const properties = style.transitionProperty
      .split(",")
      .map((property) => property.trim().toLowerCase());
    const durations = style.transitionDuration.split(",").map((value) => px(value));
    if (properties.some(movesProperty) && durations.some((duration) => duration > 0)) {
      return "css-transition";
    }
  } catch {}
  return "none";
}

function inAncestor(el: Element, selector: string): boolean {
  try {
    return Boolean(el.closest(selector));
  } catch {
    return false;
  }
}

function listLengthFor(el: Element): number {
  try {
    const list =
      el.closest("ul,ol,menu,[role='list']") ??
      (el.matches("ul,ol,menu,[role='list']") ? el : null);
    if (!list) return 0;
    return list.querySelectorAll(":scope > li, :scope > [role='listitem']").length;
  } catch {
    return 0;
  }
}

function isTextLeaf(el: Element): boolean {
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) continue;
    if (node.nodeType !== Node.ELEMENT_NODE) return false;
    const child = node as Element;
    if (!INLINE_TAGS.has(child.tagName)) return false;
    if (child.getAttribute("role")) return false;
    if (child.querySelector("img,svg,video,button,a,input,select,textarea")) return false;
  }
  return true;
}

function inlineOnly(el: Element): boolean {
  let hasElement = false;
  for (const child of Array.from(el.children)) {
    hasElement = true;
    if (!INLINE_TAGS.has(child.tagName)) return false;
    if (child.getAttribute("role")) return false;
  }
  return hasElement || (el.textContent ?? "").trim().length > 0;
}

function numberLike(text: string): boolean {
  if (!text) return false;
  return /(?:[$€£¥]\s?\d)|(?:\d\s?[%‰])|(?:\d[\s,.\u202f]\d{3})|(?:^|\s)\d{2,}(?:\s|$)/.test(
    text,
  );
}

export function signalsFor(el: Element): TargetSignals {
  const computed = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const sensitive = isSensitive(el);
  const text = sensitive ? "[redacted]" : rawText(el);
  const fullLength = sensitive ? 0 : (el.textContent ?? "").replace(/\s+/g, " ").trim().length;
  const role = el.getAttribute("role");
  const tag = el.tagName.toLowerCase();
  const inputType = el instanceof HTMLInputElement ? el.type : null;
  const href = el instanceof HTMLAnchorElement ? el.getAttribute("href") : null;
  const childCount = el.children.length;
  const hasFormField = Boolean(el.querySelector("input,textarea,select,[contenteditable='true']"));
  const submitButton = Boolean(
    el.querySelector(
      'button[type="submit"],input[type="submit"],button:not([type])',
    ),
  );
  const hasSvg = Boolean(el.querySelector("svg"));
  const elementChildren = Array.from(el.children).filter(
    (child) => !["BR", "SCRIPT", "STYLE", "TEMPLATE"].includes(child.tagName),
  );
  const hasSvgOnly =
    hasSvg &&
    text.length === 0 &&
    elementChildren.every((child) => child.tagName === "SVG" || child.tagName === "IMG");

  return {
    tag,
    role,
    inputType,
    href,
    text,
    textLength: fullLength,
    w: rect.width,
    h: rect.height,
    viewportW: window.innerWidth,
    viewportH: window.innerHeight,
    fontSize: px(computed.fontSize),
    fontWeight: Number(computed.fontWeight) || 400,
    childCount,
    elementChildren: elementChildren.length,
    hasImage: Boolean(el.querySelector("img,picture,svg,video,canvas")),
    hasHeading: Boolean(el.querySelector("h1,h2,h3,h4,h5,h6,[role='heading']")),
    hasBorder:
      px(computed.borderTopWidth) > 0 ||
      px(computed.borderRightWidth) > 0 ||
      px(computed.borderBottomWidth) > 0 ||
      px(computed.borderLeftWidth) > 0,
    hasShadow: computed.boxShadow !== "none" && Boolean(computed.boxShadow),
    radius: px(computed.borderTopLeftRadius),
    isFixed: computed.position === "fixed" || computed.position === "sticky",
    isInteractive:
      ["button", "a", "input", "select", "textarea", "summary"].includes(tag) ||
      ["button", "link", "tab", "menuitem", "switch", "checkbox", "radio", "slider"].includes(
        role ?? "",
      ) ||
      el.getAttribute("contenteditable") === "true" ||
      computed.cursor === "pointer",
    cursorPointer: computed.cursor === "pointer",
    bgImage: computed.backgroundImage !== "none" && Boolean(computed.backgroundImage),
    inNav: inAncestor(el, "nav,[role='navigation']"),
    inList: inAncestor(el, "ul,ol,menu,[role='list']"),
    listLength: listLengthFor(el),
    hasFormField,
    submitButton,
    hasSvgOnly,
    hasSvg,
    tableCells: el.querySelectorAll("td,th,[role='cell'],[role='gridcell']").length,
    tableRows: el.querySelectorAll("tr,[role='row']").length,
    isDialog: tag === "dialog",
    roleStatus: role === "status" || role === "alert" || role === "log",
    numberLike: numberLike(text),
    inlineOnly: inlineOnly(el),
    hasValueField: Boolean(el.querySelector("input,textarea,select")),
  };
}

export function takeSnapshot(el: Element): TargetSnapshot {
  const signals = signalsFor(el);
  const classification = classifySignals(signals);
  const computed = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const sensitive = signals.text === "[redacted]";
  const text = signals.text ? signals.text.slice(0, 80) : null;
  const kind: TargetKind = classification.kind;

  return {
    kind,
    confidence: classification.confidence,
    alternatives: classification.alternatives,
    tag: signals.tag,
    role: signals.role,
    text,
    textLength: signals.textLength,
    box: {
      w: Math.round(rect.width),
      h: Math.round(rect.height),
      x: Math.round(rect.left),
      y: Math.round(rect.top),
    },
    fontSize: Math.round(signals.fontSize * 10) / 10,
    fontWeight: signals.fontWeight,
    childCount: signals.childCount,
    hasImage: signals.hasImage,
    hasHeading: signals.hasHeading,
    hasBorder: signals.hasBorder,
    hasShadow: signals.hasShadow,
    hasText: signals.textLength > 0,
    radius: Math.round(signals.radius * 10) / 10,
    isFixed: signals.isFixed,
    isInteractive: signals.isInteractive,
    existingMotion: existingMotion(el),
    selector: buildSelector(el),
    path: buildPath(el),
    isTextLeaf: isTextLeaf(el),
    inNav: signals.inNav,
    inList: signals.inList,
    hasFormField: signals.hasFormField,
    hasSvgOnly: signals.hasSvgOnly,
    bgImage: signals.bgImage,
    cursorPointer: signals.cursorPointer,
    redacted: sensitive,
  };
}

export function describeSnapshot(snapshot: TargetSnapshot): string {
  const size = `${snapshot.box.w} by ${snapshot.box.h}`;
  const text = snapshot.text ? `, ${snapshot.text}` : "";
  return `${snapshot.kind}, ${size}${text}`;
}

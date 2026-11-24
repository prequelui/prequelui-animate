import type { Classification, TargetKind, TargetSignals } from "../types";

const KINDS: TargetKind[] = [
  "button",
  "link",
  "card",
  "heading",
  "text",
  "list",
  "list-item",
  "image",
  "icon",
  "input",
  "form",
  "nav",
  "section",
  "table",
  "stat",
  "badge",
  "avatar",
  "media",
  "modal",
  "toast",
];

function add(scores: Partial<Record<TargetKind, number>>, kind: TargetKind, value: number) {
  scores[kind] = (scores[kind] ?? 0) + value;
}

function isHeadingTag(tag: string): boolean {
  return /^h[1-6]$/.test(tag);
}

function hasRole(role: string | null, values: string[]): boolean {
  return Boolean(role && values.includes(role));
}

export function scoreSignals(s: TargetSignals): Partial<Record<TargetKind, number>> {
  const scores: Partial<Record<TargetKind, number>> = {};
  const tag = s.tag.toLowerCase();
  const text = s.text;
  const shortText = text.length <= 32;
  const mediumWidth = s.w >= 200 && s.w <= 760;
  const mediumHeight = s.h >= 100 && s.h <= 680;
  const roundScore = s.radius >= Math.min(s.w, s.h) / 2 - 2;

  if (tag === "button" || s.role === "button") add(scores, "button", 118);
  if (["submit", "button", "reset"].includes(s.inputType ?? "")) add(scores, "button", 108);
  if (
    !["button", "a", "input", "select", "textarea"].includes(tag) &&
    s.isInteractive &&
    s.cursorPointer &&
    s.h >= 28 &&
    s.h <= 56 &&
    shortText
  ) {
    add(scores, "button", 38);
  }
  if (s.cursorPointer && s.radius >= 6 && shortText) add(scores, "button", 6);

  if (tag === "a" && s.href) add(scores, "link", 112);
  if (s.role === "link") add(scores, "link", 104);
  if (s.inNav && (tag === "a" || s.role === "link")) add(scores, "link", 10);
  if (s.isInteractive && s.cursorPointer && !s.href) add(scores, "link", 8);

  if (["div", "article", "section", "li", "aside"].includes(tag)) {
    let card = 18;
    if (s.hasBorder) card += 22;
    if (s.hasShadow) card += 26;
    if (s.radius >= 8) card += 18;
    if (mediumWidth) card += 12;
    if (mediumHeight) card += 10;
    if (s.hasHeading) card += 10;
    if (s.hasImage) card += 8;
    if (text.length > 0) card += 4;
    if (card >= 60) add(scores, "card", card);
  }

  if (isHeadingTag(tag)) add(scores, "heading", 116);
  if (s.role === "heading") add(scores, "heading", 104);
  if (!s.isInteractive && s.fontSize >= 24 && s.fontWeight >= 600 && s.textLength <= 160) {
    add(scores, "heading", 34);
  }

  if (["p", "blockquote", "figcaption", "dd"].includes(tag)) add(scores, "text", 82);
  if (["span", "div"].includes(tag) && s.inlineOnly && s.textLength > 0) add(scores, "text", 30);
  if (s.textLength > 80) add(scores, "text", 8);
  if (tag === "p" && s.elementChildren === 0) add(scores, "text", 8);

  if (tag === "ul" || tag === "ol" || tag === "menu") add(scores, "list", 114);
  if (s.role === "list") add(scores, "list", 104);
  if (s.listLength >= 2 && !["li"].includes(tag)) add(scores, "list", 12);

  if (tag === "li") add(scores, "list-item", 108);
  if (s.role === "listitem") add(scores, "list-item", 100);
  if (s.inList && s.listLength > 0) add(scores, "list-item", 12);

  if (["img", "picture", "figure"].includes(tag)) add(scores, "image", 112);
  if (s.role === "img") add(scores, "image", 100);
  if (s.bgImage && s.textLength === 0) add(scores, "image", 34);

  if (tag === "svg" && s.w <= 48 && s.h <= 48) add(scores, "icon", 104);
  if (s.hasSvgOnly && s.textLength === 0) {
    add(scores, "icon", s.w <= 64 && s.h <= 64 ? 82 : 44);
  }
  if (tag === "path" || tag === "use") add(scores, "icon", 40);

  if (["input", "textarea", "select"].includes(tag)) add(scores, "input", 116);
  if (
    hasRole(s.role, [
      "textbox",
      "combobox",
      "switch",
      "checkbox",
      "radio",
      "slider",
      "spinbutton",
      "searchbox",
    ])
  ) {
    add(scores, "input", 104);
  }
  if (tag === "div" && s.role === "textbox") add(scores, "input", 88);

  if (tag === "form") add(scores, "form", 118);
  if (s.role === "form") add(scores, "form", 102);
  if (s.hasFormField && (s.childCount >= 2 || s.submitButton)) add(scores, "form", 36);

  if (tag === "nav") add(scores, "nav", 118);
  if (s.role === "navigation") add(scores, "nav", 104);
  if (tag === "header" && s.listLength >= 2) add(scores, "nav", 34);

  if (["section", "main", "header", "footer", "article"].includes(tag)) {
    let section = 46;
    if (s.w >= s.viewportW * 0.6) section += 20;
    if (s.h >= 240) section += 18;
    if (s.hasHeading) section += 6;
    add(scores, "section", section);
  }

  if (tag === "table") add(scores, "table", 118);
  if (hasRole(s.role, ["table", "grid", "treegrid"])) add(scores, "table", 104);
  if (s.tableRows > 0 && s.tableCells >= 2) add(scores, "table", 18);

  if (s.numberLike && s.fontSize >= 20 && text.length <= 24 && !s.isInteractive) {
    add(scores, "stat", 58);
  }
  if (s.numberLike && s.textLength <= 12) add(scores, "stat", 10);

  if (text.length > 0 && text.length <= 24 && s.h <= 30 && s.radius >= 8 && !s.isInteractive) {
    add(scores, "badge", 52);
  }
  if (
    text.length > 0 &&
    text.length <= 24 &&
    s.h <= 30 &&
    s.hasBorder &&
    !s.isInteractive
  ) {
    add(scores, "badge", 16);
  }

  if (
    (tag === "img" || tag === "svg" || s.role === "img") &&
    s.w <= 64 &&
    s.h <= 64 &&
    roundScore
  ) {
    add(scores, "avatar", 124);
  }
  if (tag === "img" && s.w <= 64 && s.h <= 64 && Math.abs(s.w - s.h) <= 2) {
    add(scores, "avatar", 22);
  }

  if (["video", "audio", "canvas", "iframe"].includes(tag)) add(scores, "media", 118);
  if (s.role === "img" && ["video", "canvas", "iframe"].includes(tag)) add(scores, "media", 30);

  if (tag === "dialog" || s.isDialog) add(scores, "modal", 118);
  if (s.role === "dialog" || s.role === "alertdialog") add(scores, "modal", 108);

  if (s.roleStatus) add(scores, "toast", 92);
  if (s.roleStatus && s.isFixed && s.w <= 420) add(scores, "toast", 20);

  return scores;
}

export function classifySignals(signals: TargetSignals): Classification {
  const scores = scoreSignals(signals);
  const ranked = KINDS.filter((kind) => (scores[kind] ?? 0) > 0)
    .map((kind) => ({ kind, score: scores[kind] ?? 0 }))
    .sort((a, b) => b.score - a.score || KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind));

  if (!ranked.length || ranked[0].score < 20) {
    return { kind: "unknown", confidence: 0, alternatives: [], scores };
  }

  const best = ranked[0];
  const second = ranked[1];
  const margin = best.score - (second?.score ?? 0);
  const confidence = Math.max(
    0.2,
    Math.min(0.98, 0.42 + Math.min(0.44, best.score / 240) + Math.min(0.12, margin / 200)),
  );
  const alternatives = ranked
    .slice(1, 3)
    .filter((item) => item.score >= Math.max(18, best.score * 0.35))
    .map((item) => item.kind);

  return {
    kind: confidence < 0.55 ? "unknown" : best.kind,
    confidence: confidence < 0.55 ? Math.min(confidence, 0.54) : confidence,
    alternatives,
    scores,
  };
}

export function confidenceLabel(confidence: number): "High" | "Likely" | "Best guess" {
  if (confidence >= 0.82) return "High";
  if (confidence >= 0.62) return "Likely";
  return "Best guess";
}

export function targetKindLabel(kind: TargetKind): string {
  if (kind === "list-item") return "List item";
  if (kind === "unknown") return "Element";
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

export function readKind(value: string): TargetKind | null {
  return KINDS.includes(value as TargetKind) ? (value as TargetKind) : null;
}

export const ALL_TARGET_KINDS: TargetKind[] = [...KINDS, "unknown"];

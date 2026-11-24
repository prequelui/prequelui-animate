import { classifySignals, targetKindLabel } from "../analyze/classify";
import { signalsFor } from "../analyze/snapshot";
import type { TargetKind } from "../types";

type Row = { element: Element; kind: TargetKind; text: string; region: string };

const SELECTOR = "h1,h2,h3,h4,h5,h6,a[href],button,input,select,textarea,p,li";

function regionOf(element: Element): string {
  const region = element.closest("header,nav,main,aside,footer,section");
  if (!region) return "Page";
  if (region.tagName === "HEADER") return "Header";
  if (region.tagName === "NAV") return "Navigation";
  if (region.tagName === "MAIN") return "Main";
  if (region.tagName === "ASIDE") return "Aside";
  if (region.tagName === "FOOTER") return "Footer";
  return "Section";
}

export class PageOutline {
  readonly root: HTMLDivElement;
  private list: HTMLDivElement;
  private onSelect: (element: Element) => void;
  private onClose: () => void;
  private scope: HTMLElement | null;
  private previousFocus: Element | null = null;

  constructor(
    onSelect: (element: Element) => void,
    onClose: () => void,
    scope: HTMLElement | null = null,
  ) {
    this.onSelect = onSelect;
    this.onClose = onClose;
    this.scope = scope;
    this.root = document.createElement("div");
    this.root.className = "pb-outline";
    this.root.setAttribute("role", "dialog");
    this.root.setAttribute("aria-modal", "true");
    this.root.setAttribute("aria-label", "Page outline");
    this.root.hidden = true;

    const card = document.createElement("div");
    card.className = "pb-outline-card";
    const header = document.createElement("div");
    header.className = "pb-panel-head";
    const title = document.createElement("strong");
    title.textContent = "Page outline";
    const close = document.createElement("button");
    close.type = "button";
    close.className = "pb-icon-button";
    close.setAttribute("aria-label", "Close the page outline");
    close.textContent = "×";
    close.addEventListener("click", () => this.close());
    header.appendChild(title);
    header.appendChild(close);
    this.list = document.createElement("div");
    this.list.className = "pb-outline-list";
    card.appendChild(header);
    card.appendChild(this.list);
    this.root.appendChild(card);
    this.root.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        this.close();
      }
    });
  }

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  open() {
    if (!this.root.hidden) return;
    this.previousFocus = document.activeElement;
    this.render();
    this.root.hidden = false;
    const first = this.list.querySelector("button");
    if (first instanceof HTMLElement) first.focus();
  }

  close() {
    if (this.root.hidden) return;
    this.root.hidden = true;
    if (this.previousFocus instanceof HTMLElement && this.previousFocus.isConnected) {
      this.previousFocus.focus();
    }
    this.onClose();
  }

  private rows(): Row[] {
    const rows: Row[] = [];
    const seen = new Set<Element>();
    for (const element of Array.from(document.querySelectorAll(SELECTOR))) {
      if (seen.has(element)) continue;
      seen.add(element);
      if (element.closest("#prequel-bot-root")) continue;
      if (element.hasAttribute("data-prequel-ignore")) continue;
      if (this.scope && !this.scope.contains(element)) continue;
      const rect = element.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) continue;
      const style = getComputedStyle(element);
      if (style.visibility === "hidden" || style.display === "none") continue;
      try {
        const kind = classifySignals(signalsFor(element)).kind;
        if (kind === "section" || kind === "unknown") continue;
        const text = (element.getAttribute("aria-label") ?? element.textContent ?? "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 64);
        rows.push({ element, kind, text, region: regionOf(element) });
      } catch {}
      if (rows.length >= 120) break;
    }
    return rows;
  }

  private render() {
    this.list.replaceChildren();
    const rows = this.rows();
    let currentRegion = "";
    for (const row of rows) {
      if (row.region !== currentRegion) {
        currentRegion = row.region;
        const heading = document.createElement("div");
        heading.className = "pb-outline-region";
        heading.textContent = currentRegion;
        this.list.appendChild(heading);
      }
      const button = document.createElement("button");
      button.type = "button";
      button.className = "pb-outline-row";
      const kind = document.createElement("span");
      kind.className = "pb-outline-kind";
      kind.textContent = targetKindLabel(row.kind);
      const text = document.createElement("span");
      text.className = "pb-outline-text";
      text.textContent = row.text || "(no text)";
      button.appendChild(kind);
      button.appendChild(text);
      button.addEventListener("click", () => {
        this.close();
        this.onSelect(row.element);
      });
      this.list.appendChild(button);
    }
    if (!rows.length) {
      const empty = document.createElement("p");
      empty.className = "pb-muted";
      empty.textContent = "No selectable element found on this page.";
      this.list.appendChild(empty);
    }
  }
}

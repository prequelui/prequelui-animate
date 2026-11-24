import { classifySignals, targetKindLabel } from "../analyze/classify";
import { buildPath, signalsFor, takeSnapshot } from "../analyze/snapshot";
import type { TargetKind, TargetSnapshot } from "../types";
import { SelectionLayer } from "./selection";

const EXCLUDED_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "LINK",
  "META",
  "HEAD",
  "HTML",
  "TITLE",
  "BASE",
]);

const FOCUSABLE =
  'a[href],button,input,select,textarea,summary,[tabindex]:not([tabindex="-1"]),[role="button"],[role="link"],[role="tab"],[role="menuitem"]';

export type PickerCallbacks = {
  isOverlay: (node: EventTarget | null) => boolean;
  onHover: (element: Element, kind: TargetKind) => void;
  onLeave: () => void;
  onPick: (element: Element, snapshot: TargetSnapshot) => void;
  onCancel: () => void;
  onArm: () => void;
  onAnnounce: (message: string) => void;
  onOutline: () => void;
};

export class Picker {
  private layer: SelectionLayer;
  private callbacks: PickerCallbacks;
  private scope: HTMLElement | null;
  private armed = false;
  private current: Element | null = null;
  private rawTarget: Element | null = null;
  private lastPointerType = "mouse";
  private touchTarget: Element | null = null;
  private touchCount = 0;
  private frame = 0;
  private lastX = 0;
  private lastY = 0;
  private focusables: Element[] = [];
  private focusIndex = -1;
  private detach: (() => void)[] = [];
  private globalStyle: HTMLStyleElement | null = null;

  constructor(layer: SelectionLayer, callbacks: PickerCallbacks, scope: HTMLElement | null = null) {
    this.layer = layer;
    this.callbacks = callbacks;
    this.scope = scope;
  }

  get isArmed(): boolean {
    return this.armed;
  }

  arm() {
    if (this.armed) return;
    this.armed = true;
    document.documentElement.dataset.prequelArmed = "true";
    this.installGlobalStyle();
    this.callbacks.onArm();
    this.focusables = this.collectFocusables();
    this.focusIndex = -1;
    document.addEventListener("pointermove", this.onPointerMove, { passive: true });
    document.addEventListener("pointerdown", this.onPointerDown, true);
    document.addEventListener("click", this.onClick, true);
    document.addEventListener("contextmenu", this.onContextMenu, true);
    document.addEventListener("keydown", this.onKeyDown, true);
    window.addEventListener("scroll", this.onScroll, true);
    window.addEventListener("resize", this.onScroll);
  }

  disarm() {
    if (!this.armed) return;
    this.armed = false;
    delete document.documentElement.dataset.prequelArmed;
    this.globalStyle?.remove();
    this.globalStyle = null;
    this.current = null;
    this.rawTarget = null;
    this.touchTarget = null;
    this.touchCount = 0;
    this.layer.hide();
    document.removeEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("pointerdown", this.onPointerDown, true);
    document.removeEventListener("click", this.onClick, true);
    document.removeEventListener("contextmenu", this.onContextMenu, true);
    document.removeEventListener("keydown", this.onKeyDown, true);
    window.removeEventListener("scroll", this.onScroll, true);
    window.removeEventListener("resize", this.onScroll);
    for (const detach of this.detach) detach();
    this.detach = [];
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  private installGlobalStyle() {
    if (this.globalStyle) return;
    const style = document.createElement("style");
    style.id = "prequel-bot-global";
    style.textContent =
      'html[data-prequel-armed],html[data-prequel-armed] *{cursor:crosshair !important;user-select:none !important;}';
    document.head.appendChild(style);
    this.globalStyle = style;
  }

  showSelection(element: Element) {
    this.layer.select(element);
    this.layer.setPath(buildPath(element));
  }

  clearSelection() {
    this.layer.hide();
  }

  private inScope(target: Element): boolean {
    if (!this.scope) return true;
    if (target === this.scope) return false;
    if (!this.scope.isConnected) return false;
    return this.scope.contains(target);
  }

  private isExcluded(target: Element | null): boolean {
    if (!target) return true;
    if (this.callbacks.isOverlay(target)) return true;
    if (!this.inScope(target)) return true;
    if (EXCLUDED_TAGS.has(target.tagName)) return true;
    if (target.hasAttribute("data-prequel-ignore")) return true;
    try {
      if (target.closest("[data-prequel-ignore]")) return true;
    } catch {}
    if (target === document.body && target.children.length === 0) return true;
    const rect = target.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return true;
    const style = getComputedStyle(target);
    if (style.visibility === "hidden" || style.display === "none" || style.opacity === "0") {
      return true;
    }
    return false;
  }

  private resolve(x: number, y: number, alt: boolean): Element | null {
    let target = document.elementFromPoint(x, y) as Element | null;
    if (!target) return null;
    try {
      if (target.shadowRoot) {
        const inner = target.shadowRoot.elementFromPoint(x, y);
        if (inner && inner !== target) {
          target = inner;
        } else {
          return target;
        }
      }
    } catch {}
    if (this.callbacks.isOverlay(target)) return null;
    if (target.nodeType !== Node.ELEMENT_NODE) {
      target = target.parentElement;
    }
    try {
      const ignored = target?.closest("[data-prequel-ignore]");
      if (ignored && /^(BUTTON|A|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(ignored.tagName)) {
        return null;
      }
    } catch {}
    if (alt && this.rawTarget) {
      let parent = this.rawTarget.parentElement;
      while (parent && this.isExcluded(parent)) parent = parent.parentElement;
      return parent;
    }
    while (target && this.isExcluded(target)) {
      target = target.parentElement;
    }
    return target;
  }

  private hover(target: Element | null) {
    if (!target || target === this.current) return;
    this.current = target;
    try {
      const signals = signalsFor(target);
      const kind = classifySignals(signals).kind;
      this.layer.show(target, kind);
      this.layer.setPath(buildPath(target));
      this.callbacks.onHover(target, kind);
    } catch {
      this.callbacks.onLeave();
    }
  }

  private lock(target: Element) {
    if (this.isExcluded(target)) return;
    let snapshot: TargetSnapshot;
    try {
      snapshot = takeSnapshot(target);
    } catch {
      return;
    }
    this.layer.select(target);
    this.layer.setPath(snapshot.path);
    this.current = target;
    this.disarm();
    this.callbacks.onPick(target, snapshot);
  }

  private onPointerMove = (event: PointerEvent) => {
    if (!this.armed) return;
    this.lastPointerType = event.pointerType;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    this.rawTarget = document.elementFromPoint(event.clientX, event.clientY) as Element | null;
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      if (!this.armed) return;
      const target = this.resolve(this.lastX, this.lastY, event.altKey);
      this.hover(target);
    });
  };

  private onPointerDown = (event: PointerEvent) => {
    if (!this.armed) return;
    if (this.callbacks.isOverlay(event.target)) return;
    this.lastPointerType = event.pointerType;
    event.preventDefault();
    event.stopPropagation();
  };

  private onClick = (event: MouseEvent) => {
    if (!this.armed) return;
    if (this.callbacks.isOverlay(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    const target = this.resolve(event.clientX, event.clientY, event.altKey);
    if (!target) return;
    if (this.lastPointerType === "touch") {
      if (this.touchTarget !== target) {
        this.touchTarget = target;
        this.touchCount = 1;
        this.hover(target);
        this.callbacks.onAnnounce(
          `${targetKindLabel(classifySignals(signalsFor(target)).kind)}. Tap again to select.`,
        );
        return;
      }
      this.touchCount += 1;
      if (this.touchCount < 2) return;
      this.touchCount = 0;
    }
    this.lock(target);
  };

  private onContextMenu = (event: MouseEvent) => {
    if (!this.armed) return;
    event.preventDefault();
    event.stopPropagation();
  };

  private onScroll = () => {
    if (!this.armed || !this.current) return;
    const target = this.current;
    if (!target.isConnected) {
      this.current = null;
      this.layer.hide();
      return;
    }
    try {
      const signals = signalsFor(target);
      this.layer.show(target, classifySignals(signals).kind);
    } catch {}
  };

  private collectFocusables(): Element[] {
    try {
      return Array.from(document.querySelectorAll(FOCUSABLE)).filter((element) => {
        if (this.isExcluded(element)) return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
    } catch {
      return [];
    }
  }

  private cycleFocusable(step: number) {
    if (!this.focusables.length) this.focusables = this.collectFocusables();
    if (!this.focusables.length) return;
    this.focusIndex = (this.focusIndex + step + this.focusables.length) % this.focusables.length;
    const target = this.focusables[this.focusIndex]!;
    if (!target.isConnected) {
      this.focusables = this.collectFocusables();
      return;
    }
    this.rawTarget = target;
    this.hover(target);
    this.callbacks.onAnnounce(
      `${targetKindLabel(classifySignals(signalsFor(target)).kind)}. ${(target.textContent ?? "").trim().slice(0, 60)}. Press P to read the description.`,
    );
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (!this.armed) return;
    const key = event.key;
    if (key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      this.disarm();
      this.callbacks.onCancel();
      return;
    }
    if (key === "Tab") {
      event.preventDefault();
      event.stopPropagation();
      this.cycleFocusable(event.shiftKey ? -1 : 1);
      return;
    }
    if (key === "Enter" || key === " " || key === "Spacebar") {
      if (!this.current) {
        this.cycleFocusable(1);
        event.preventDefault();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this.lock(this.current);
      return;
    }
    if (key === "p" || key === "P") {
      event.preventDefault();
      if (this.current) {
        const snapshot = takeSnapshot(this.current);
        this.callbacks.onAnnounce(
          `${snapshot.kind}, ${snapshot.text ?? "no text"}, ${snapshot.box.w} by ${snapshot.box.h}.`,
        );
      }
      return;
    }
    if (key === "o" || key === "O") {
      event.preventDefault();
      this.callbacks.onOutline();
      return;
    }
    if (!this.current) return;
    let next: Element | null = null;
    if (key === "ArrowUp") {
      next = this.current.parentElement;
      while (next && this.isExcluded(next)) next = next.parentElement;
    } else if (key === "ArrowDown") {
      next = Array.from(this.current.children).find((child) => !this.isExcluded(child)) ?? null;
    } else if (key === "ArrowLeft") {
      const parent = this.current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter((child) => !this.isExcluded(child));
        const index = siblings.indexOf(this.current);
        next = siblings[Math.max(0, index - 1)] ?? null;
      }
    } else if (key === "ArrowRight") {
      const parent = this.current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter((child) => !this.isExcluded(child));
        const index = siblings.indexOf(this.current);
        next = siblings[Math.min(siblings.length - 1, index + 1)] ?? null;
      }
    }
    if (next) {
      event.preventDefault();
      this.hover(next);
    }
  };
}

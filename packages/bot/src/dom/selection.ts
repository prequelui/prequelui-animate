import type { TargetKind } from "../types";
import { targetKindLabel } from "../analyze/classify";

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  return node;
}

export class SelectionLayer {
  readonly root: HTMLDivElement;
  private hoverRect: HTMLDivElement;
  private hoverInner: HTMLDivElement;
  private selectedRect: HTMLDivElement;
  private chip: HTMLDivElement;
  private trail: HTMLDivElement;

  constructor() {
    this.root = el("div", "pb-selection");
    this.hoverRect = el("div", "pb-select-rect");
    this.hoverInner = el("div", "pb-select-inner");
    this.selectedRect = el("div", "pb-select-selected");
    this.chip = el("div", "pb-chip");
    this.trail = el("div", "pb-trail");
    this.hoverRect.appendChild(this.hoverInner);
    this.root.appendChild(this.hoverRect);
    this.root.appendChild(this.selectedRect);
    this.root.appendChild(this.chip);
    this.root.appendChild(this.trail);
    this.hide();
  }

  show(element: Element, kind: TargetKind, selected = false) {
    const rect = element.getBoundingClientRect();
    const style = `left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;`;
    this.hoverRect.style.cssText = style;
    this.hoverInner.style.cssText = style;
    this.hoverRect.style.display = "block";
    this.hoverInner.style.display = "block";
    this.chip.style.display = "inline-flex";
    this.chip.textContent = `${targetKindLabel(kind)} · ${Math.round(rect.width)} × ${Math.round(rect.height)}`;
    const labelTop = rect.top - 30;
    this.chip.style.left = `${Math.max(8, Math.min(window.innerWidth - 180, rect.left))}px`;
    this.chip.style.top = `${labelTop < 8 ? rect.bottom + 8 : labelTop}px`;
    if (selected) {
      this.selectedRect.style.cssText = style;
      this.selectedRect.style.display = "block";
    } else {
      this.selectedRect.style.display = "none";
    }
  }

  select(element: Element) {
    const rect = element.getBoundingClientRect();
    this.selectedRect.style.cssText = `left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;`;
    this.selectedRect.style.display = "block";
    this.hoverRect.style.display = "none";
    this.hoverInner.style.display = "none";
    this.chip.style.display = "none";
  }

  setPath(path: string[]) {
    if (!path.length) {
      this.trail.style.display = "none";
      return;
    }
    this.trail.style.display = "block";
    this.trail.textContent = path.slice(-4).join(" › ");
  }

  hide() {
    this.hoverRect.style.display = "none";
    this.hoverInner.style.display = "none";
    this.selectedRect.style.display = "none";
    this.chip.style.display = "none";
    this.trail.style.display = "none";
  }
}

import type {
  Framework,
  Proposal,
  ProposalSet,
  Recipe,
  RecipeOptions,
  TargetKind,
  TargetSnapshot,
} from "../types";
import { ALL_TARGET_KINDS, confidenceLabel, targetKindLabel } from "../analyze/classify";
import { recipeDefaults } from "../recipes/catalog";
import { installFor } from "../output/install";
import { promptFor } from "../output/prompt";
import { copyText, generateCode } from "../output/code";
import { docsUrlFor, FRAMEWORK_LABELS, registryItem } from "../recipes/registry";

type Tab = "code" | "install" | "agent";

export type PanelCallbacks = {
  framework: Framework;
  bridge: { label: string } | null;
  demo?: boolean;
  onChangeTarget: () => void;
  onClose: () => void;
  onPreview: (proposal: Proposal, options: RecipeOptions) => void;
  onSelectProposal: (proposal: Proposal, options: RecipeOptions) => void;
  onStop: () => void;
  onApply: (proposal: Proposal, options: RecipeOptions) => void;
  onFramework: (framework: Framework) => void;
  onToast: (message: string) => void;
  onAnnounce: (message: string) => void;
  onOutline: () => void;
  onHelp: () => void;
  onKindChange: (kind: TargetKind) => void;
  onSendAgent: (recipe: Recipe, options: RecipeOptions) => void;
  onPreviewAnyway: () => void;
};

const FRAMEWORKS: Framework[] = ["react", "vue", "svelte", "solid", "vanilla"];

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const KEYWORDS = new Set([
  "import", "from", "export", "default", "function", "return", "const", "let", "var",
  "if", "else", "true", "false", "null", "new", "await", "async", "type", "interface",
]);

/** Quiet syntax colours: built from text nodes only, never from HTML strings. */
function highlight(code: string): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const pattern =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(<\/?[A-Za-z][\w.:-]*)|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_$][\w$]*)\b/g;
  const push = (text: string, className?: string) => {
    if (!text) return;
    if (!className) {
      fragment.appendChild(document.createTextNode(text));
      return;
    }
    const span = document.createElement("span");
    span.className = className;
    span.textContent = text;
    fragment.appendChild(span);
  };
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(code))) {
    push(code.slice(last, match.index));
    if (match[1]) push(match[1], "pb-tok-c");
    else if (match[2]) push(match[2], "pb-tok-s");
    else if (match[3]) push(match[3], "pb-tok-t");
    else if (match[4]) push(match[4], "pb-tok-n");
    else if (match[5]) push(match[5], KEYWORDS.has(match[5]) ? "pb-tok-k" : undefined);
    last = pattern.lastIndex;
  }
  push(code.slice(last));
  return fragment;
}

function copyIcon(): SVGSVGElement {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  for (const [key, value] of [
    ["viewBox", "0 0 24 24"], ["width", "13"], ["height", "13"], ["fill", "none"],
    ["stroke", "currentColor"], ["stroke-width", "2"], ["stroke-linecap", "round"],
    ["stroke-linejoin", "round"], ["aria-hidden", "true"],
  ]) svg.setAttribute(key, value);
  const rect = document.createElementNS(ns, "rect");
  for (const [key, value] of [["x", "9"], ["y", "9"], ["width", "13"], ["height", "13"], ["rx", "2"]]) rect.setAttribute(key, value);
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1");
  svg.append(rect, path);
  return svg;
}

/** A quiet outline copy button with an icon, instead of a heavy filled one. */
function decorateCopy(node: HTMLButtonElement, label: string) {
  node.className = "pb-copy-button";
  const text = document.createElement("span");
  text.textContent = label;
  node.replaceChildren(copyIcon(), text);
}

function flashCopied(node: HTMLButtonElement, label: string) {
  const text = node.querySelector("span");
  if (!text) return;
  node.dataset.copied = "true";
  text.textContent = "Copied";
  window.setTimeout(() => {
    delete node.dataset.copied;
    text.textContent = label;
  }, 1400);
}

function button(label: string, className: string, onClick: () => void): HTMLButtonElement {
  const node = el("button", className, label);
  node.type = "button";
  node.addEventListener("click", (event) => {
    event.stopPropagation();
    onClick();
  });
  return node;
}

export class Panel {
  readonly root: HTMLDivElement;
  private callbacks: PanelCallbacks;
  private target: TargetSnapshot | null = null;
  private proposals: Proposal[] = [];
  private note: string | null = null;
  private selectedId: string | null = null;
  private options: RecipeOptions = {};
  private framework: Framework;
  private tab: Tab = "code";
  private previewing = false;
  private previousFocus: Element | null = null;
  private closeTimer = 0;
  private isOpen = false;
  private reduced = false;
  private tuneOpen = false;

  private kindBadge: HTMLSpanElement;
  private headText: HTMLSpanElement;
  private headDims: HTMLSpanElement;
  private kindSelect: HTMLSelectElement;
  private status: HTMLParagraphElement;
  private cardsWrap: HTMLDivElement;
  private tuneWrap: HTMLDivElement;
  private tuneBody: HTMLDivElement;
  private outputWrap: HTMLDivElement;
  private outputBody: HTMLDivElement;
  private tabButtons = new Map<Tab, HTMLButtonElement>();
  private codePre: HTMLElement | null = null;
  private installNote: HTMLElement | null = null;
  private frameworkRow: HTMLDivElement | null = null;
  private tuneValues: { duration: HTMLOutputElement; stiffness: HTMLOutputElement; damping: HTMLOutputElement; intensity: HTMLOutputElement; distance: HTMLOutputElement; scale: HTMLOutputElement } | null = null;

  constructor(callbacks: PanelCallbacks) {
    this.callbacks = callbacks;
    this.framework = callbacks.framework;
    this.root = el("div", "pb-panel");
    this.root.setAttribute("role", "dialog");
    this.root.setAttribute("aria-modal", "false");
    this.root.setAttribute("aria-labelledby", "pb-panel-title");
    this.root.setAttribute("lang", "en");
    this.root.hidden = true;

    const header = el("div", "pb-panel-head");
    const titleWrap = el("div", "pb-panel-title-wrap");
    const titleLine = el("div", "pb-panel-title-line");
    this.kindBadge = el("span", "pb-kind-badge", "Element");
    const title = el("strong", "pb-panel-title", "");
    title.id = "pb-panel-title";
    this.headText = el("span", "pb-panel-text", "");
    this.headDims = el("span", "pb-panel-dims", "");
    titleLine.appendChild(this.kindBadge);
    titleLine.appendChild(title);
    titleWrap.appendChild(titleLine);
    titleWrap.appendChild(this.headText);
    titleWrap.appendChild(this.headDims);

    const headActions = el("div", "pb-panel-actions");
    const change = button("Change target", "pb-ghost-button", () => this.callbacks.onChangeTarget());
    const close = button("×", "pb-icon-button", () => this.callbacks.onClose());
    close.setAttribute("aria-label", "Close the panel");
    headActions.appendChild(change);
    headActions.appendChild(close);
    header.appendChild(titleWrap);
    header.appendChild(headActions);

    const meta = el("div", "pb-panel-meta");
    this.kindSelect = el("select", "pb-kind-select") as HTMLSelectElement;
    this.kindSelect.setAttribute("aria-label", "Treat the target as another type");
    for (const kind of ALL_TARGET_KINDS) {
      const option = document.createElement("option");
      option.value = kind;
      option.textContent = targetKindLabel(kind);
      this.kindSelect.appendChild(option);
    }
    this.kindSelect.addEventListener("change", () => {
      const kind = this.kindSelect.value as TargetKind;
      this.callbacks.onKindChange(kind);
    });
    const outline = button("Page outline", "pb-text-button", () => this.callbacks.onOutline());
    const help = button("?", "pb-icon-button", () => this.callbacks.onHelp());
    help.setAttribute("aria-label", "Open the keyboard help");
    meta.appendChild(this.kindSelect);
    meta.appendChild(outline);
    meta.appendChild(help);

    this.status = el("p", "pb-status", "");
    this.status.setAttribute("aria-live", "polite");

    this.cardsWrap = el("div", "pb-cards");
    this.cardsWrap.setAttribute("role", "radiogroup");
    this.cardsWrap.setAttribute("aria-label", "Motion proposals");

    this.tuneWrap = el("div", "pb-tune");
    const tuneHead = el("div", "pb-tune-head");
    const tuneTitle = button("Tune", "pb-tune-toggle", () => {
      this.tuneOpen = !this.tuneOpen;
      this.tuneBody.hidden = !this.tuneOpen;
      tuneTitle.setAttribute("aria-expanded", this.tuneOpen ? "true" : "false");
    });
    tuneTitle.setAttribute("aria-expanded", "false");
    const reset = button("Reset", "pb-text-button", () => this.resetTuning());
    tuneHead.appendChild(tuneTitle);
    tuneHead.appendChild(reset);
    this.tuneBody = el("div", "pb-tune-body");
    this.tuneBody.hidden = true;
    this.tuneWrap.appendChild(tuneHead);
    this.tuneWrap.appendChild(this.tuneBody);

    const tabs = el("div", "pb-tabs");
    tabs.setAttribute("role", "tablist");
    for (const tab of ["code", "install", "agent"] as Tab[]) {
      const label = tab === "code" ? "Code" : tab === "install" ? "Install" : "Send to agent";
      const tabButton = button(label, "pb-tab", () => this.setTab(tab));
      tabButton.setAttribute("role", "tab");
      tabButton.setAttribute("aria-selected", tab === this.tab ? "true" : "false");
      this.tabButtons.set(tab, tabButton);
      tabs.appendChild(tabButton);
    }
    this.outputWrap = el("div", "pb-output");
    this.outputBody = el("div", "pb-output-body");
    this.outputWrap.appendChild(tabs);
    this.outputWrap.appendChild(this.outputBody);

    const footer = el("div", "pb-panel-foot");
    const security = el(
      "span",
      "pb-muted",
      callbacks.demo
        ? "Demo · this playground only · Nothing leaves this page"
        : "Dev only · Nothing leaves this page",
    );
    const docs = el("a", "pb-text-button", "Docs");
    docs.href = "#";
    docs.target = "_blank";
    docs.rel = "noreferrer noopener";
    footer.appendChild(security);
    footer.appendChild(docs);

    this.root.appendChild(header);
    this.root.appendChild(meta);
    this.root.appendChild(this.status);
    this.root.appendChild(this.cardsWrap);
    this.root.appendChild(this.tuneWrap);
    this.root.appendChild(this.outputWrap);
    this.root.appendChild(footer);
    this.root.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        this.callbacks.onClose();
      }
    });
  }

  get opened(): boolean {
    return this.isOpen;
  }

  get currentTarget(): TargetSnapshot | null {
    return this.target;
  }

  get currentRecipe(): Recipe | null {
    return this.proposals.find((proposal) => proposal.recipe.id === this.selectedId)?.recipe ?? null;
  }

  get currentOptions(): RecipeOptions {
    return this.options;
  }

  currentProposal(): Proposal | null {
    return this.proposals.find((proposal) => proposal.recipe.id === this.selectedId) ?? null;
  }

  showTab(tab: Tab) {
    this.setTab(tab);
  }

  setReduced(reduced: boolean) {
    this.reduced = reduced;
    this.renderStatus();
  }

  thinking(snapshot: TargetSnapshot) {
    this.target = snapshot;
    this.proposals = [];
    this.note = null;
    this.selectedId = null;
    this.options = {};
    this.previewing = false;
    this.cardsWrap.replaceChildren();
    this.tuneWrap.hidden = true;
    this.outputWrap.hidden = true;
    this.updateHeader();
    this.status.textContent = "Analysing this element…";
    this.root.classList.remove("is-ready");
    this.show();
  }

  showProposals(set: ProposalSet) {
    this.target = set.target;
    this.proposals = set.proposals;
    this.note = set.note;
    this.selectedId = set.proposals[0]?.recipe.id ?? null;
    this.options = { ...(set.proposals[0]?.options ?? {}) };
    this.previewing = false;
    this.updateHeader();
    this.renderStatus();
    this.renderCards();
    this.renderTune();
    this.renderOutput();
    this.tuneWrap.hidden = false;
    this.outputWrap.hidden = false;
    this.root.classList.add("is-ready");
    this.place();
    window.setTimeout(() => {
      const first = this.cardsWrap.querySelector<HTMLElement>(".pb-card.is-active");
      first?.focus();
    }, 60);
    this.callbacks.onAnnounce(
      `3 motions for this ${targetKindLabel(set.target.kind).toLowerCase()}. Recommended: ${set.proposals[0]?.recipe.title ?? ""}.`,
    );
  }

  updateTargetKind(snapshot: TargetSnapshot) {
    this.target = snapshot;
    this.updateHeader();
    this.renderStatus();
  }

  setPreviewing(previewing: boolean) {
    this.previewing = previewing;
    this.updatePreviewButtons();
    this.renderStatus();
  }

  show() {
    if (this.isOpen) {
      this.place();
      return;
    }
    this.isOpen = true;
    this.previousFocus = document.activeElement;
    if (this.closeTimer) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = 0;
    }
    this.root.hidden = false;
    this.root.classList.remove("is-visible");
    requestAnimationFrame(() => {
      this.root.classList.add("is-visible");
      this.place();
    });
    window.setTimeout(() => this.place(), 120);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.root.classList.remove("is-visible");
    this.closeTimer = window.setTimeout(() => {
      this.root.hidden = true;
      this.closeTimer = 0;
    }, 180);
    if (this.previousFocus instanceof HTMLElement && this.previousFocus.isConnected) {
      try {
        this.previousFocus.focus();
      } catch {}
    }
    this.previousFocus = null;
  }

  private updateHeader() {
    if (!this.target) return;
    const target = this.target;
    this.kindBadge.textContent = targetKindLabel(target.kind);
    this.headText.textContent = target.text ? target.text : "(no text)";
    this.headDims.textContent = `${target.box.w} × ${target.box.h}`;
    this.kindSelect.value = target.kind;
    const current = this.currentRecipe;
    if (current) {
      const link = this.root.querySelector<HTMLAnchorElement>(".pb-panel-foot a");
      if (link) link.href = docsUrlFor(current.registry[0]);
    }
  }

  setFramework(framework: Framework) {
    this.framework = framework;
    this.renderOutput();
  }

  private renderStatus() {
    if (!this.target) return;
    if (!this.proposals.length) {
      this.status.textContent = "Analysing this element…";
      return;
    }
    const confidence = confidenceLabel(this.target.confidence);
    const note = this.note ? ` · ${this.note}` : "";
    const motion = this.previewing ? " · Previewing" : "";
    this.status.textContent = `3 motions for this ${targetKindLabel(this.target.kind).toLowerCase()} · ${confidence}${note}${motion}`;
  }

  private renderCards() {
    this.cardsWrap.replaceChildren();
    const fragment = document.createDocumentFragment();
    this.proposals.forEach((proposal, index) => {
      const card = el("div", "pb-card");
      card.setAttribute("role", "radio");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-checked", proposal.recipe.id === this.selectedId ? "true" : "false");
      card.dataset.recipe = proposal.recipe.id;
      card.style.animationDelay = `${index * 30}ms`;
      if (proposal.recipe.id === this.selectedId) card.classList.add("is-active");
      const role = el(
        "span",
        `pb-role pb-role-${proposal.role}`,
        proposal.role === "recommended"
          ? "Recommended"
          : proposal.role === "expressive"
            ? "Expressive"
            : "Alternative",
      );
      const title = el("strong", "pb-card-title", proposal.recipe.title);
      const registry = el("span", "pb-card-registry", proposal.recipe.registry[0] ?? "");
      const description = el("p", "pb-card-desc", proposal.recipe.description);
      const actions = el("div", "pb-card-actions");
      const preview = button(
        this.previewing && proposal.recipe.id === this.selectedId ? "Stop" : "Preview",
        "pb-text-button",
        () => {
          this.select(proposal);
          if (this.previewing) {
            this.previewing = false;
            this.callbacks.onStop();
            this.setPreviewing(false);
          } else {
            this.previewing = true;
            this.callbacks.onPreview(proposal, this.options);
            this.setPreviewing(true);
          }
        },
      );
      preview.dataset.action = "preview";
      const use = button("Use", "pb-primary-button", () => {
        this.select(proposal);
        this.callbacks.onApply(proposal, this.options);
      });
      actions.appendChild(preview);
      actions.appendChild(use);

      card.appendChild(role);
      card.appendChild(title);
      card.appendChild(registry);
      card.appendChild(description);
      card.appendChild(actions);
      card.addEventListener("mouseenter", () => {
        this.select(proposal, false);
        this.callbacks.onPreview(proposal, this.options);
        this.previewing = true;
        this.setPreviewing(true);
      });
      card.addEventListener("focus", () => {
        this.select(proposal, false);
        this.callbacks.onPreview(proposal, this.options);
        this.previewing = true;
        this.setPreviewing(true);
      });
      card.addEventListener("click", () => this.select(proposal, true));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          this.select(proposal, true);
        }
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          event.preventDefault();
          const next = this.proposals[Math.min(this.proposals.length - 1, this.proposals.indexOf(proposal) + 1)];
          if (next) this.focusCard(next);
        }
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          event.preventDefault();
          const previous = this.proposals[Math.max(0, this.proposals.indexOf(proposal) - 1)];
          if (previous) this.focusCard(previous);
        }
        if (event.key === "p" || event.key === "P") {
          event.preventDefault();
          this.callbacks.onPreview(proposal, this.options);
          this.previewing = true;
          this.setPreviewing(true);
        }
      });
      fragment.appendChild(card);
    });
    this.cardsWrap.appendChild(fragment);
    this.updatePreviewButtons();
  }

  private focusCard(proposal: Proposal) {
    const card = this.cardsWrap.querySelector<HTMLElement>(`[data-recipe="${proposal.recipe.id}"]`);
    card?.focus();
  }

  private select(proposal: Proposal, announce = true) {
    if (this.selectedId === proposal.recipe.id) return;
    this.selectedId = proposal.recipe.id;
    this.options = { ...proposal.options };
    for (const card of Array.from(this.cardsWrap.querySelectorAll<HTMLElement>(".pb-card"))) {
      const active = card.dataset.recipe === this.selectedId;
      card.classList.toggle("is-active", active);
      card.setAttribute("aria-checked", active ? "true" : "false");
    }
    this.renderTune();
    this.renderOutput();
    this.updateHeader();
    if (announce) {
      this.callbacks.onSelectProposal(proposal, this.options);
      this.callbacks.onAnnounce(`${proposal.recipe.title}. ${proposal.recipe.description}`);
    }
  }

  private updatePreviewButtons() {
    for (const card of Array.from(this.cardsWrap.querySelectorAll<HTMLElement>(".pb-card"))) {
      const preview = card.querySelector<HTMLButtonElement>('[data-action="preview"]');
      if (!preview) continue;
      preview.textContent = this.previewing && card.dataset.recipe === this.selectedId ? "Stop" : "Preview";
    }
  }

  private renderTune() {
    const recipe = this.currentRecipe;
    if (!recipe) return;
    const defaults = recipeDefaults(recipe);
    const options = { ...defaults, ...this.options };
    const spring = options.spring ?? { stiffness: defaults.stiffness, damping: defaults.damping };
    this.tuneBody.replaceChildren();
    this.tuneBody.hidden = !this.tuneOpen;
    const toggle = this.tuneWrap.querySelector<HTMLButtonElement>(".pb-tune-toggle");
    toggle?.setAttribute("aria-expanded", this.tuneOpen ? "true" : "false");
    this.tuneValues = null;

    const row = (label: string, input: HTMLInputElement, output: HTMLOutputElement, suffix = "") => {
      const wrap = el("div", "pb-tune-row");
      const name = el("label", "pb-tune-label", label);
      const id = `pb-tune-${recipe!.id}-${label.toLowerCase().replace(/[^a-z]/g, "")}`;
      input.id = id;
      name.htmlFor = id;
      const value = el("span", "pb-tune-value");
      output.value = `${input.value}${suffix}`;
      output.textContent = `${input.value}${suffix}`;
      value.appendChild(output);
      wrap.appendChild(name);
      wrap.appendChild(input);
      wrap.appendChild(value);
      return wrap;
    };

    const duration = document.createElement("input");
    duration.type = "range";
    duration.min = "120";
    duration.max = "1200";
    duration.step = "20";
    duration.value = String(Math.round(options.duration ?? defaults.duration));
    const stiffness = document.createElement("input");
    stiffness.type = "range";
    stiffness.min = "80";
    stiffness.max = "800";
    stiffness.step = "10";
    stiffness.value = String(Math.round(spring.stiffness));
    const damping = document.createElement("input");
    damping.type = "range";
    damping.min = "8";
    damping.max = "60";
    damping.step = "1";
    damping.value = String(Math.round(spring.damping));
    const intensity = document.createElement("input");
    intensity.type = "range";
    intensity.min = "0.2";
    intensity.max = "1";
    intensity.step = "0.05";
    intensity.value = String(options.intensity ?? defaults.intensity);
    const distance = document.createElement("input");
    distance.type = "range";
    distance.min = "4";
    distance.max = "48";
    distance.step = "2";
    distance.value = String(Math.round(options.distance ?? defaults.distance));
    const scale = document.createElement("input");
    scale.type = "range";
    scale.min = "0.8";
    scale.max = "1.05";
    scale.step = "0.01";
    scale.value = String(options.scale ?? defaults.scale);

    const outputs = {
      duration: el("output"),
      stiffness: el("output"),
      damping: el("output"),
      intensity: el("output"),
      distance: el("output"),
      scale: el("output"),
    };
    this.tuneValues = outputs;

    const update = () => {
      const next: RecipeOptions = {
        ...this.options,
        duration: Number(duration.value),
        spring: { stiffness: Number(stiffness.value), damping: Number(damping.value) },
        intensity: Number(intensity.value),
        distance: Number(distance.value),
        scale: Number(scale.value),
      };
      this.options = next;
      outputs.duration.value = `${duration.value} ms`;
      outputs.duration.textContent = `${duration.value} ms`;
      outputs.stiffness.value = stiffness.value;
      outputs.stiffness.textContent = stiffness.value;
      outputs.damping.value = damping.value;
      outputs.damping.textContent = damping.value;
      outputs.intensity.value = intensity.value;
      outputs.intensity.textContent = intensity.value;
      outputs.distance.value = `${distance.value} px`;
      outputs.distance.textContent = `${distance.value} px`;
      outputs.scale.value = scale.value;
      outputs.scale.textContent = scale.value;
      this.renderOutput();
      const proposal = this.proposals.find((item) => item.recipe.id === this.selectedId);
      if (proposal) {
        this.callbacks.onPreview(proposal, next);
        this.previewing = true;
        this.updatePreviewButtons();
      }
    };

    for (const input of [duration, stiffness, damping, intensity, distance, scale]) {
      input.addEventListener("input", update);
    }

    const loopWrap = el("div", "pb-tune-row");
    const loopLabel = el("label", "pb-tune-label", "Loop");
    const loop = document.createElement("input");
    loop.type = "checkbox";
    loop.checked = Boolean(this.options.loop);
    loop.addEventListener("change", () => {
      this.options = { ...this.options, loop: loop.checked };
      const proposal = this.proposals.find((item) => item.recipe.id === this.selectedId);
      if (proposal) {
        this.callbacks.onPreview(proposal, this.options);
        this.previewing = true;
        this.updatePreviewButtons();
      }
    });
    loopWrap.appendChild(loopLabel);
    loopWrap.appendChild(loop);

    this.tuneBody.appendChild(row("Duration", duration, outputs.duration, " ms"));
    this.tuneBody.appendChild(row("Stiffness", stiffness, outputs.stiffness));
    this.tuneBody.appendChild(row("Damping", damping, outputs.damping));
    this.tuneBody.appendChild(row("Intensity", intensity, outputs.intensity));
    this.tuneBody.appendChild(row("Distance", distance, outputs.distance, " px"));
    this.tuneBody.appendChild(row("Scale", scale, outputs.scale));
    this.tuneBody.appendChild(loopWrap);
    if (this.reduced) {
      const reduced = el("p", "pb-muted", "Reduced motion is on.");
      const anyway = button("Preview anyway", "pb-text-button", () => this.callbacks.onPreviewAnyway());
      const wrap = el("div", "pb-tune-row");
      wrap.appendChild(reduced);
      wrap.appendChild(anyway);
      this.tuneBody.appendChild(wrap);
    }
  }

  private resetTuning() {
    const proposal = this.proposals.find((item) => item.recipe.id === this.selectedId);
    if (!proposal) return;
    this.options = { ...proposal.options };
    this.renderTune();
    this.renderOutput();
    this.callbacks.onPreview(proposal, this.options);
    this.previewing = true;
    this.updatePreviewButtons();
  }

  private setTab(tab: Tab) {
    this.tab = tab;
    for (const [key, node] of this.tabButtons) {
      node.setAttribute("aria-selected", key === tab ? "true" : "false");
      node.classList.toggle("is-active", key === tab);
    }
    this.renderOutput();
  }

  private renderOutput() {
    const recipe = this.currentRecipe;
    const target = this.target;
    this.outputBody.replaceChildren();
    this.codePre = null;
    this.installNote = null;
    this.frameworkRow = null;
    if (!recipe || !target) return;

    for (const [key, node] of this.tabButtons) {
      node.setAttribute("aria-selected", key === this.tab ? "true" : "false");
      node.classList.toggle("is-active", key === this.tab);
    }

    const frameworkRow = el("div", "pb-framework-row");
    frameworkRow.setAttribute("role", "group");
    frameworkRow.setAttribute("aria-label", "Framework");
    const entry = registryItem(recipe.registry[0]);
    for (const framework of FRAMEWORKS) {
      const available = Boolean(entry?.frameworks.includes(framework));
      const node = button(FRAMEWORK_LABELS[framework], "pb-framework-button", () => {
        this.framework = framework;
        this.callbacks.onFramework(framework);
        this.renderOutput();
      });
      if (framework === this.framework) node.classList.add("is-active");
      if (!available) node.classList.add("is-limited");
      node.setAttribute("aria-pressed", framework === this.framework ? "true" : "false");
      frameworkRow.appendChild(node);
    }
    this.frameworkRow = frameworkRow;
    this.outputBody.appendChild(frameworkRow);

    if (this.tab === "code") {
      const code = generateCode(recipe, this.options, target, this.framework);
      const bar = el("div", "pb-output-bar");
      const note = el(
        "span",
        "pb-muted",
        entry && !entry.frameworks.includes(this.framework) ? "React only · native snippet shown" : "",
      );
      const copy = button("Copy code", "pb-primary-button", () => {
        void copyText(code).then((ok) => {
          if (ok) flashCopied(copy, "Copy code");
          this.callbacks.onToast(ok ? `Copied ${FRAMEWORK_LABELS[this.framework]} code` : "Copy failed. Select the code manually.");
        });
      });
      decorateCopy(copy, "Copy code");
      bar.appendChild(note);
      bar.appendChild(copy);
      const pre = el("pre", "pb-code");
      const codeEl = el("code");
      codeEl.appendChild(highlight(code));
      pre.appendChild(codeEl);
      this.codePre = pre;
      this.outputBody.appendChild(bar);
      this.outputBody.appendChild(pre);
    } else if (this.tab === "install") {
      const install = installFor(recipe, this.framework);
      const bar = el("div", "pb-output-bar");
      const copy = button("Copy command", "pb-primary-button", () => {
        if (!install.command) return;
        void copyText(install.command).then((ok) => {
          if (ok) flashCopied(copy, "Copy command");
          this.callbacks.onToast(ok ? "Install command copied" : "Copy failed. Select the command manually.");
        });
      });
      decorateCopy(copy, "Copy command");
      bar.appendChild(el("span", "pb-muted", install.available ? "shadcn CLI" : "React command"));
      bar.appendChild(copy);
      const pre = el("pre", "pb-code");
      const codeEl = el("code", "", install.command ?? "No install command for this framework.");
      pre.appendChild(codeEl);
      this.installNote = el("p", "pb-note", install.note ?? "");
      this.outputBody.appendChild(bar);
      this.outputBody.appendChild(pre);
      if (install.note) this.outputBody.appendChild(this.installNote);
      const link = el("a", "pb-text-button", "Open the component docs");
      link.href = install.docsUrl;
      link.target = "_blank";
      link.rel = "noreferrer noopener";
      this.outputBody.appendChild(link);
    } else {
      const prompt = promptFor(recipe, this.framework, target, {
        stiffness: this.options.spring?.stiffness,
        damping: this.options.spring?.damping,
        scale: this.options.scale ?? recipe.defaults.scale,
        duration: this.options.duration,
      });
      if (this.callbacks.bridge) {
        const bar = el("div", "pb-output-bar");
        bar.appendChild(el("span", "pb-muted", this.callbacks.bridge.label));
        const send = button("Send to agent", "pb-primary-button", () => this.callbacks.onSendAgent(recipe, this.options));
        bar.appendChild(send);
        this.outputBody.appendChild(bar);
        const summary = el("dl", "pb-bridge-fields");
        const fields: [string, string][] = [
          ["Element", `${target.tag}${target.text ? ` · ${target.text}` : ""}`],
          ["Type", targetKindLabel(target.kind)],
          ["Motion", `${recipe.title} (${recipe.registry[0]})`],
          ["Framework", FRAMEWORK_LABELS[this.framework]],
          ["Path", target.path.join(" › ")],
        ];
        for (const [key, value] of fields) {
          const dt = el("dt", "", key);
          const dd = el("dd", "", value);
          summary.appendChild(dt);
          summary.appendChild(dd);
        }
        this.outputBody.appendChild(summary);
      } else {
        const bar = el("div", "pb-output-bar");
        bar.appendChild(el("span", "pb-muted", "No local bridge · copy the prompt"));
        const copy = button("Copy for agent", "pb-primary-button", () => {
          void copyText(prompt).then((ok) => {
            if (ok) flashCopied(copy, "Copy for agent");
            this.callbacks.onToast(ok ? "Agent prompt copied" : "Copy failed. Select the prompt manually.");
          });
        });
        decorateCopy(copy, "Copy for agent");
        bar.appendChild(copy);
        this.outputBody.appendChild(bar);
      }
      const pre = el("pre", "pb-code pb-prompt");
      const codeEl = el("code", "", prompt);
      pre.appendChild(codeEl);
      this.outputBody.appendChild(pre);
    }
  }

  private place() {
    if (!this.target || !this.isOpen) return;
    const mobile = window.innerWidth <= 640;
    this.root.classList.toggle("is-sheet", mobile);
    if (mobile) {
      this.root.style.left = "";
      this.root.style.top = "";
      return;
    }
    const margin = 16;
    const gap = 12;
    const panel = this.root.getBoundingClientRect();
    const width = panel.width || 360;
    const height = Math.min(panel.height || 480, window.innerHeight * 0.72);
    const rect = this.target.box;
    let left = rect.x + rect.w + gap;
    let top = rect.y;
    if (left + width > window.innerWidth - margin) {
      left = rect.x - width - gap;
    }
    if (left < margin) {
      left = Math.max(margin, Math.min(window.innerWidth - width - margin, rect.x));
      top = rect.y + rect.h + gap;
      if (top + height > window.innerHeight - margin) {
        top = rect.y - height - gap;
      }
    }
    left = Math.max(margin, Math.min(window.innerWidth - width - margin, left));
    top = Math.max(margin, Math.min(window.innerHeight - height - margin, top));
    this.root.style.left = `${Math.round(left)}px`;
    this.root.style.top = `${Math.round(top)}px`;
  }

  destroy() {
    if (this.closeTimer) window.clearTimeout(this.closeTimer);
    this.root.remove();
  }
}

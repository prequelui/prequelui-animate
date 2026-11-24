import styles from "./styles/bot.css";
import type {
  BotConfig,
  BotState,
  Framework,
  MascotState,
  PrequelBotHandle,
  Proposal,
  Recipe,
  RecipeOptions,
  TargetKind,
  TargetSnapshot,
} from "./types";
import {
  readFramework,
  readPosition,
  resolveReduced,
  watchReduced,
  writeFramework,
  writeLastRecipe,
  writePosition,
} from "./config";
import { takeSnapshot } from "./analyze/snapshot";
import { propose } from "./recipes/proposal";
import { copyText, generateCode } from "./output/code";
import { installFor } from "./output/install";
import { Mascot } from "./mascot";
import { Picker } from "./dom/picker";
import { SelectionLayer } from "./dom/selection";
import { Panel } from "./dom/panel";
import { Toast } from "./dom/toast";
import { HelpPanel } from "./dom/help";
import { PageOutline } from "./a11y/page-outline";
import { Announcer } from "./a11y/announcer";
import { PreviewSession } from "./preview/session";
import { BridgeClient, makeBridgeRequest } from "./bridge/client";
import { StateMachine } from "./state";
import { version } from "./version";

function matchesHotkey(event: KeyboardEvent, hotkey: string): boolean {
  const parts = hotkey.split("+").map((part) => part.trim().toLowerCase());
  const key = parts[parts.length - 1];
  const needAlt = parts.includes("alt");
  const needCtrl = parts.includes("ctrl") || parts.includes("control");
  const needMeta = parts.includes("meta") || parts.includes("cmd");
  const needShift = parts.includes("shift");
  if (event.altKey !== needAlt) return false;
  if (event.ctrlKey !== needCtrl) return false;
  if (event.metaKey !== needMeta) return false;
  if (event.shiftKey !== needShift) return false;
  return event.key.toLowerCase() === key;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function resolveScope(selector: string | null): HTMLElement | null {
  if (!selector) return null;
  try {
    const node = document.querySelector(selector);
    return node instanceof HTMLElement ? node : null;
  } catch {
    return null;
  }
}

export class BotApp implements PrequelBotHandle {
  private config: BotConfig;
  private host: HTMLDivElement;
  private shadow: ShadowRoot;
  private root: HTMLDivElement;
  private mascot: Mascot;
  private layer: SelectionLayer;
  private picker: Picker;
  private panel: Panel;
  private toast: Toast;
  private help: HelpPanel;
  private outline: PageOutline;
  private announcer: Announcer;
  private preview = new PreviewSession();
  private machine = new StateMachine();
  private bridge: BridgeClient | null = null;
  private bridgeUnsubscribe: (() => void) | null = null;
  private framework: Framework;
  private targetElement: Element | null = null;
  private snapshot: TargetSnapshot | null = null;
  private proposals: Proposal[] = [];
  private analysisTimer = 0;
  private observer: MutationObserver | null = null;
  private reduced: boolean;
  private forceMotion = false;
  private destroyed = false;
  private detach: (() => void)[] = [];
  private forcedBanner: HTMLDivElement | null = null;
  private demoBadge: HTMLDivElement | null = null;
  private scopeEl: HTMLElement | null = null;
  private anchorFrame = 0;

  constructor(target: HTMLElement, config: BotConfig) {
    this.config = config;
    this.reduced = resolveReduced(config.reducedMotion);
    this.framework = readFramework(config.framework);
    this.scopeEl = resolveScope(config.scope);

    this.host = document.createElement("div");
    this.host.id = "prequel-bot-root";
    this.host.style.cssText =
      "position:fixed;inset:0;z-index:2147483000;pointer-events:none;contain:layout style;";
    this.shadow = this.host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = styles;
    this.shadow.appendChild(style);

    this.root = document.createElement("div");
    this.root.className = "pb-root";
    this.root.setAttribute("lang", "en");
    this.shadow.appendChild(this.root);

    this.announcer = new Announcer();
    this.layer = new SelectionLayer();
    this.toast = new Toast();
    this.help = new HelpPanel(() => {});
    this.outline = new PageOutline(
      (element) => {
        this.targetElement = element;
        this.selectElement(element);
      },
      () => this.mascot.element.focus(),
      this.scopeEl,
    );

    if (config.bridge && (config.bridge.token || config.bridge.url)) {
      this.bridge = new BridgeClient(config.bridge);
      if (config.bridge.token) this.bridge.useToken(config.bridge.token);
    }

    this.panel = new Panel({
      framework: this.framework,
      bridge: this.bridgeLabel(),
      demo: config.demo,
      onChangeTarget: () => this.startSelection(),
      onClose: () => this.close(),
      onPreview: (proposal, options) => this.previewProposal(proposal, options),
      onSelectProposal: (proposal, options) => this.previewProposal(proposal, options),
      onStop: () => this.stopPreview(true),
      onApply: (proposal, options) => this.applyProposal(proposal, options),
      onFramework: (framework) => {
        this.framework = framework;
        writeFramework(framework);
      },
      onToast: (message) => this.toast.show(message),
      onAnnounce: (message) => this.announcer.announce(message),
      onOutline: () => this.outline.open(),
      onHelp: () => this.help.open(),
      onKindChange: (kind) => this.changeKind(kind),
      onSendAgent: (recipe, options) => this.sendToAgent(recipe, options),
      onPreviewAnyway: () => {
        this.forceMotion = true;
        const proposal = this.panel.currentProposal();
        if (proposal) this.previewProposal(proposal, this.panel.currentOptions, true);
      },
    });
    this.panel.setReduced(this.reduced);

    this.mascot = new Mascot({
      size: config.size,
      label: config.label,
      showLabel: config.showLabel,
      position: readPosition(config.position),
      reduced: this.reduced,
      draggable: !this.scopeEl,
      onActivate: () => {
        if (this.picker.isArmed) {
          this.picker.disarm();
          this.machine.set("idle");
          this.mascot.flash("wink", 200);
          this.toast.show("Selection cancelled");
        } else {
          this.startSelection();
        }
      },
      onHelp: () => this.help.open(),
      onStateChange: () => {},
    });

    this.root.appendChild(this.layer.root);
    this.root.appendChild(this.mascot.dock);
    this.root.appendChild(this.panel.root);
    this.root.appendChild(this.help.root);
    this.root.appendChild(this.outline.root);
    this.root.appendChild(this.toast.root);
    this.root.appendChild(this.announcer.root);

    if (config.demo) {
      this.root.dataset.demo = "true";
      this.host.dataset.prequelDemo = "true";
      this.demoBadge = document.createElement("div");
      this.demoBadge.className = "pb-demo-badge";
      this.demoBadge.textContent = "Demo";
      this.demoBadge.setAttribute("aria-hidden", "true");
      this.root.appendChild(this.demoBadge);
    } else if (config.force) {
      this.forcedBanner = document.createElement("div");
      this.forcedBanner.className = "pb-force-banner";
      this.forcedBanner.textContent = "Not for production";
      this.root.appendChild(this.forcedBanner);
    }

    this.picker = new Picker(this.layer, {
      isOverlay: (node) => this.isOverlay(node),
      onHover: (element, kind) => this.onHover(element, kind),
      onLeave: () => this.mascot.setLookAt(null),
      onPick: (element, snapshot) => this.onPick(element, snapshot),
      onCancel: () => {
        this.machine.set("idle");
        this.mascot.flash("wink", 200);
        this.toast.show("Selection cancelled");
        this.announcer.announce("Selection cancelled.");
      },
      onArm: () => {
        this.machine.set("armed");
        this.mascot.setState("pills");
        this.toast.show("Selection mode — click an element, Esc to cancel");
        this.announcer.announce(
          "Selection mode. Use Tab to move, arrows for parents and children, Enter to select, Escape to cancel.",
        );
      },
      onAnnounce: (message) => this.announcer.announce(message),
      onOutline: () => this.outline.open(),
    }, this.scopeEl);

    target.appendChild(this.host);
    this.bind();
    this.observe();
    this.bindScope();
    window.__PREQUEL_BOT__ = this;
    window.prequelBot = this;
  }

  private bridgeLabel(): { label: string } | null {
    if (!this.bridge) return null;
    return { label: this.bridge.label };
  }

  private bind() {
    const onKeyDown = (event: KeyboardEvent) => {
      if (this.help.isOpen || this.outline.isOpen) return;
      if (event.key === "Escape" && this.panel.opened) {
        event.preventDefault();
        this.close();
        return;
      }
      if (isTypingTarget(event.target)) return;
      if (this.config.hotkey && matchesHotkey(event, this.config.hotkey)) {
        event.preventDefault();
        if (this.picker.isArmed) {
          this.picker.disarm();
          this.machine.set("idle");
        } else {
          this.startSelection();
        }
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        this.preview.pause();
      } else if (this.preview.active && this.panel.currentProposal()) {
        this.preview.resume();
      }
    };
    const onPageHide = () => this.preview.stop();
    window.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    this.detach.push(
      () => window.removeEventListener("keydown", onKeyDown, true),
      () => document.removeEventListener("visibilitychange", onVisibility),
      () => window.removeEventListener("pagehide", onPageHide),
    );
    this.detach.push(
      watchReduced((reduced) => {
        this.reduced = this.config.reducedMotion === "system" ? reduced : this.reduced;
        this.mascot.setReduced(this.reduced);
        this.panel.setReduced(this.reduced);
        if (this.reduced && this.preview.active) this.stopPreview(false);
        if (this.snapshot && this.proposals.length && this.panel.opened) this.refreshProposals();
      }),
    );
  }

  private observe() {
    try {
      this.observer = new MutationObserver(() => {
        if (this.targetElement && !this.targetElement.isConnected) {
          this.stopPreview(false);
          this.panel.close();
          this.toast.show("The element left the page");
          this.machine.set("idle");
          this.targetElement = null;
          this.snapshot = null;
        }
      });
      this.observer.observe(document.body, { childList: true, subtree: true });
    } catch {}
  }

  private bindScope() {
    const scope = this.scopeEl;
    if (!scope) return;
    const place = () => {
      this.anchorFrame = 0;
      if (this.destroyed || !scope.isConnected) return;
      const rect = scope.getBoundingClientRect();
      const left = Math.max(rect.left, 0);
      const right = Math.min(rect.right, window.innerWidth);
      const top = Math.max(rect.top, 0);
      const bottom = Math.min(rect.bottom, window.innerHeight);
      const width = right - left;
      const height = bottom - top;
      if (width < 120 || height < 200) {
        this.mascot.dock.style.visibility = "hidden";
        if (this.demoBadge) this.demoBadge.style.visibility = "hidden";
        return;
      }
      this.mascot.dock.style.visibility = "visible";
      this.mascot.setAnchor({ left, top, width, height });
      if (this.demoBadge) {
        const dock = this.mascot.dock.getBoundingClientRect();
        const badgeWidth = this.demoBadge.offsetWidth || 52;
        const badgeHeight = this.demoBadge.offsetHeight || 26;
        this.demoBadge.style.visibility = "visible";
        this.demoBadge.style.left = `${Math.round(
          Math.max(8, Math.min(window.innerWidth - badgeWidth - 8, dock.right - badgeWidth)),
        )}px`;
        this.demoBadge.style.top = `${Math.round(Math.max(8, dock.top - badgeHeight - 8))}px`;
      }
    };
    const schedule = () => {
      if (this.anchorFrame) return;
      this.anchorFrame = requestAnimationFrame(place);
    };
    let resizeObserver: ResizeObserver | null = null;
    try {
      resizeObserver = new ResizeObserver(schedule);
      resizeObserver.observe(scope);
    } catch {}
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    this.detach.push(() => {
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      resizeObserver?.disconnect();
      if (this.anchorFrame) cancelAnimationFrame(this.anchorFrame);
      this.anchorFrame = 0;
    });
    schedule();
  }

  private isOverlay(node: EventTarget | null): boolean {
    if (!node) return false;
    if (node === this.host) return true;
    if (node instanceof Node) return this.host.contains(node);
    return false;
  }

  private startSelection() {
    if (this.panel.opened) this.stopPreview(false);
    this.forceMotion = false;
    this.picker.arm();
    this.mascot.setState("pills");
  }

  private selectElement(element: Element) {
    let snapshot: TargetSnapshot;
    try {
      snapshot = takeSnapshot(element);
    } catch {
      return;
    }
    this.onPick(element, snapshot);
  }

  private onHover(element: Element, kind: TargetKind) {
    const rect = element.getBoundingClientRect();
    this.mascot.setLookAt({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    void kind;
  }

  private onPick(element: Element, snapshot: TargetSnapshot) {
    this.targetElement = element;
    this.snapshot = snapshot;
    try {
      this.layer.select(element);
      this.layer.setPath(snapshot.path);
    } catch {}
    this.machine.set("thinking");
    this.mascot.setState("think");
    this.announcer.announce("Analysing this element.");
    if (window.innerWidth <= 640) {
      const keepVisible = () => {
        try {
          const sheetTop = window.innerHeight - Math.min(window.innerHeight * 0.52, 640);
          const rect = element.getBoundingClientRect();
          if (rect.bottom > sheetTop - 32) {
            window.scrollBy({ top: rect.bottom - (sheetTop - 32) });
          }
          if (rect.top < 80) window.scrollBy({ top: rect.top - 80 });
        } catch {}
      };
      try {
        element.scrollIntoView({ block: "center" });
        window.scrollBy({ top: -Math.round(window.innerHeight * 0.18) });
      } catch {}
      keepVisible();
      window.setTimeout(keepVisible, 620);
    }
    this.panel.thinking(snapshot);
    if (this.analysisTimer) window.clearTimeout(this.analysisTimer);
    this.analysisTimer = window.setTimeout(() => {
      this.analysisTimer = 0;
      this.refreshProposals(true);
      this.machine.set("proposing");
      this.mascot.setState("pills");
      const rect = element.getBoundingClientRect();
      this.mascot.setLookAt({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }, 550);
  }

  private refreshProposals(announce = false) {
    if (!this.snapshot) return;
    const set = propose(this.snapshot, {
      viewportW: window.innerWidth,
      viewportH: window.innerHeight,
      reduced: this.reduced,
    });
    this.proposals = set.proposals;
    this.panel.showProposals(set);
    if (announce) {
      this.toast.show(`3 motions for this ${this.snapshot.kind}`);
    }
  }

  private changeKind(kind: TargetKind) {
    if (!this.snapshot) return;
    this.stopPreview(false);
    this.snapshot = { ...this.snapshot, kind, confidence: 1, alternatives: [] };
    this.panel.updateTargetKind(this.snapshot);
    this.refreshProposals();
    this.mascot.flash("think", 420);
  }

  private effectiveReduced(): boolean {
    return this.reduced && !this.forceMotion;
  }

  private previewProposal(proposal: Proposal, options: RecipeOptions, force = false) {
    if (!this.targetElement || !this.targetElement.isConnected) {
      this.toast.show("The element left the page");
      return;
    }
    this.forceMotion = force || this.forceMotion;
    try {
      this.preview.play(this.targetElement, proposal.recipe, options, this.effectiveReduced());
      this.machine.set("previewing");
      this.panel.setPreviewing(true);
      const rect = this.targetElement.getBoundingClientRect();
      this.mascot.setLookAt({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    } catch {
      this.toast.show("This motion could not be previewed");
    }
  }

  private stopPreview(flash: boolean) {
    const wasActive = this.preview.active;
    this.preview.stop();
    this.forceMotion = false;
    this.panel.setPreviewing(false);
    if (wasActive && flash) {
      this.toast.show("Preview restored");
      this.mascot.flash("pills", 600);
    }
    if (this.machine.get() === "previewing") this.machine.set("proposing");
  }

  private applyProposal(proposal: Proposal, options: RecipeOptions) {
    if (!this.snapshot) return;
    this.stopPreview(false);
    this.panel.showTab("code");
    const code = generateCode(proposal.recipe, options, this.snapshot, this.framework);
    const install = installFor(proposal.recipe, this.framework);
    void copyText(code).then((ok) => {
      this.toast.show(ok ? `Copied ${this.framework} code` : "Code ready in the panel");
    });
    this.machine.set("applied");
    this.mascot.flash("happy", 1700);
    this.announcer.announce(
      `Copied ${proposal.recipe.title} for ${this.framework}. Your page is unchanged.`,
    );
    writeLastRecipe(this.snapshot.kind, proposal.recipe.id);
    try {
      this.config.onApply?.({
        framework: this.framework,
        kind: this.snapshot.kind,
        text: this.snapshot.text,
        recipe: proposal.recipe.id,
        options,
        code,
        install: install.command,
      });
    } catch {}
  }

  private async sendToAgent(recipe: Recipe, options: RecipeOptions) {
    if (!this.snapshot) return;
    if (!this.bridge || !this.bridge.connected) {
      this.toast.show("No local bridge. Use Copy for agent.");
      return;
    }
    this.mascot.setState("think");
    try {
      const request = makeBridgeRequest(
        `req_${Math.random().toString(36).slice(2, 8)}`,
        recipe,
        options,
        this.snapshot,
        this.framework,
        `Apply the ${recipe.id} motion to the existing ${this.snapshot.kind}. Keep semantics, focus states and reduced motion.`,
      );
      const id = await this.bridge.send(request);
      this.toast.show("Sent to your agent");
      this.mascot.setState("pills");
      this.bridgeUnsubscribe?.();
      this.bridgeUnsubscribe = this.bridge.subscribe(id, (status) => {
        if (status.state === "done") {
          this.toast.show(status.summary ?? "Your agent finished the change");
          this.mascot.flash("happy", 1700);
          this.bridgeUnsubscribe?.();
          this.bridgeUnsubscribe = null;
        } else if (status.state === "error") {
          this.toast.show(status.error ?? "The bridge returned an error");
          this.mascot.flash("tilt", 900);
          this.bridgeUnsubscribe?.();
          this.bridgeUnsubscribe = null;
        } else if (status.state === "in_progress") {
          this.mascot.setState("think");
        }
      });
    } catch {
      this.mascot.flash("tilt", 900);
      this.toast.show("The bridge did not answer. Copy the prompt instead.");
      this.announcer.announce("Bridge error. Your page is unchanged.", true);
    }
  }

  open() {
    if (this.snapshot && this.targetElement?.isConnected) {
      this.panel.show();
      this.machine.set("proposing");
    } else {
      this.startSelection();
    }
  }

  close() {
    if (this.analysisTimer) {
      window.clearTimeout(this.analysisTimer);
      this.analysisTimer = 0;
    }
    this.stopPreview(false);
    this.picker.disarm();
    this.panel.close();
    this.machine.set("idle");
    this.mascot.flash("wink", 200);
    this.mascot.setState("auto");
    try {
      this.mascot.element.focus({ preventScroll: true });
    } catch {}
  }

  select() {
    this.startSelection();
  }

  cancel() {
    this.close();
  }

  apply() {
    const proposal = this.panel.currentProposal();
    if (proposal) this.applyProposal(proposal, this.panel.currentOptions);
  }

  getState(): BotState {
    return this.machine.get();
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.analysisTimer) window.clearTimeout(this.analysisTimer);
    this.observer?.disconnect();
    this.observer = null;
    this.picker.disarm();
    this.preview.stop();
    this.bridgeUnsubscribe?.();
    this.bridge?.destroy();
    for (const detach of this.detach) detach();
    this.mascot.destroy();
    this.panel.destroy();
    this.help.destroy();
    this.toast.destroy();
    this.outline.root.remove();
    this.host.remove();
    if (window.__PREQUEL_BOT__ === this) {
      delete window.__PREQUEL_BOT__;
      delete window.prequelBot;
    }
  }

  setCorner(position: BotConfig["position"]) {
    this.mascot.setCorner(position);
    writePosition(position);
  }

  setMascotState(state: MascotState | "auto") {
    this.mascot.setState(state);
  }

  version(): string {
    return version;
  }
}

const SHORTCUTS: [string, string][] = [
  ["Alt + Shift + A", "Arm selection from anywhere"],
  ["Enter / Space", "Arm selection on the mascot"],
  ["Tab / Shift + Tab", "Move between interactive targets"],
  ["Arrows", "Walk the hierarchy: parent, child, siblings"],
  ["Enter", "Select the target"],
  ["P", "Read the target description"],
  ["O", "Open the page outline"],
  ["Escape", "Stop the preview, then close, then disarm"],
  ["?", "Open this help"],
];

const STATES: [string, string][] = [
  ["dots", "Resting, nothing to do"],
  ["think", "Reading the element"],
  ["pills", "Ready with proposals"],
  ["look", "Following your pointer or the target"],
  ["happy", "A motion was applied"],
  ["blink", "A small sign of life"],
  ["wink", "The panel is closing"],
  ["tilt", "A playful beat in the loop"],
];

export class HelpPanel {
  readonly root: HTMLDivElement;
  private onClose: () => void;
  private previousFocus: Element | null = null;

  constructor(onClose: () => void) {
    this.onClose = onClose;
    this.root = document.createElement("div");
    this.root.className = "pb-help";
    this.root.hidden = true;
    this.root.setAttribute("role", "dialog");
    this.root.setAttribute("aria-modal", "true");
    this.root.setAttribute("aria-labelledby", "pb-help-title");

    const card = document.createElement("div");
    card.className = "pb-help-card";
    const head = document.createElement("div");
    head.className = "pb-panel-head";
    const title = document.createElement("strong");
    title.id = "pb-help-title";
    title.textContent = "Prequel Bot";
    const close = document.createElement("button");
    close.type = "button";
    close.className = "pb-icon-button";
    close.setAttribute("aria-label", "Close the help");
    close.textContent = "×";
    close.addEventListener("click", () => this.close());
    head.appendChild(title);
    head.appendChild(close);

    const lead = document.createElement("p");
    lead.className = "pb-help-lead";
    lead.textContent = "Select an element to animate. Everything stays on this page.";

    const shortcuts = document.createElement("section");
    shortcuts.appendChild(this.heading("Keyboard"));
    const list = document.createElement("dl");
    list.className = "pb-help-list";
    for (const [keys, description] of SHORTCUTS) {
      const dt = document.createElement("dt");
      dt.textContent = keys;
      const dd = document.createElement("dd");
      dd.textContent = description;
      list.appendChild(dt);
      list.appendChild(dd);
    }
    shortcuts.appendChild(list);

    const states = document.createElement("section");
    states.appendChild(this.heading("What the mascot means"));
    const stateList = document.createElement("dl");
    stateList.className = "pb-help-list";
    for (const [state, description] of STATES) {
      const dt = document.createElement("dt");
      dt.textContent = state;
      const dd = document.createElement("dd");
      dd.textContent = description;
      stateList.appendChild(dt);
      stateList.appendChild(dd);
    }
    states.appendChild(stateList);

    const privacy = document.createElement("section");
    privacy.appendChild(this.heading("Privacy"));
    const privacyText = document.createElement("p");
    privacyText.className = "pb-muted";
    privacyText.textContent =
      "No telemetry, no cookies, no analytics. The recipe catalogue is embedded and the local bridge binds to 127.0.0.1 only. Nothing leaves this page unless you explicitly send a request.";
    privacy.appendChild(privacyText);

    const foot = document.createElement("div");
    foot.className = "pb-panel-foot";
    const security = document.createElement("span");
    security.className = "pb-muted";
    security.textContent = "Dev only · Nothing leaves this page";
    const docs = document.createElement("a");
    docs.className = "pb-text-button";
    docs.textContent = "Docs";
    docs.href = "/docs/bot";
    docs.target = "_blank";
    docs.rel = "noreferrer noopener";
    foot.appendChild(security);
    foot.appendChild(docs);

    card.appendChild(head);
    card.appendChild(lead);
    card.appendChild(shortcuts);
    card.appendChild(states);
    card.appendChild(privacy);
    card.appendChild(foot);
    this.root.appendChild(card);
    this.root.addEventListener("click", (event) => {
      if (event.target === this.root) this.close();
    });
    this.root.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        this.close();
      }
    });
  }

  private heading(text: string): HTMLHeadingElement {
    const node = document.createElement("h3");
    node.textContent = text;
    return node;
  }

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  open() {
    if (!this.root.hidden) return;
    this.previousFocus = document.activeElement;
    this.root.hidden = false;
    const first = this.root.querySelector<HTMLElement>("button, a");
    first?.focus();
  }

  close() {
    if (this.root.hidden) return;
    this.root.hidden = true;
    if (this.previousFocus instanceof HTMLElement && this.previousFocus.isConnected) {
      try {
        this.previousFocus.focus();
      } catch {}
    }
    this.onClose();
  }

  destroy() {
    this.root.remove();
  }
}

export class Announcer {
  readonly root: HTMLDivElement;
  private polite: HTMLDivElement;
  private assertive: HTMLDivElement;

  constructor() {
    this.root = document.createElement("div");
    this.root.className = "pb-announcer";
    this.polite = document.createElement("div");
    this.polite.setAttribute("aria-live", "polite");
    this.polite.setAttribute("aria-atomic", "true");
    this.assertive = document.createElement("div");
    this.assertive.setAttribute("aria-live", "assertive");
    this.assertive.setAttribute("aria-atomic", "true");
    this.root.appendChild(this.polite);
    this.root.appendChild(this.assertive);
  }

  announce(message: string, assertive = false) {
    const node = assertive ? this.assertive : this.polite;
    node.textContent = "";
    window.setTimeout(() => {
      node.textContent = message;
    }, 20);
  }
}

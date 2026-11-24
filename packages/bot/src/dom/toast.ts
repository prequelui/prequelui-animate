export class Toast {
  readonly root: HTMLDivElement;
  private timer = 0;

  constructor() {
    this.root = document.createElement("div");
    this.root.className = "pb-toast";
    this.root.setAttribute("role", "status");
    this.root.setAttribute("aria-live", "polite");
  }

  show(message: string) {
    this.root.textContent = message;
    this.root.classList.add("is-visible");
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.root.classList.remove("is-visible");
      this.timer = 0;
    }, 2400);
  }

  destroy() {
    if (this.timer) window.clearTimeout(this.timer);
    this.root.remove();
  }
}

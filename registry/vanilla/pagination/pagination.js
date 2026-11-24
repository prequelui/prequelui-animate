import { animate } from "motion";

let uid = 0;

export function createPagination(root, options = {}) {
  const { pages = 5, defaultPage = 1, onPageChange = undefined } = options;
  const id = `pagination-${++uid}`;
  let current = defaultPage;

  root.innerHTML = `
    <nav aria-label="Pagination" class="relative flex items-center gap-1" data-pagination="${id}">
      <button type="button" aria-label="Previous page" data-prev
        class="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent disabled:opacity-40">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <span class="indicator absolute inset-y-0 left-0 rounded-md border bg-background shadow-sm" aria-hidden="true"></span>
      ${Array.from({ length: pages }, (_, index) => index + 1)
        .map(
          (item) => `<button type="button" data-page="${item}"
            class="relative flex size-8 items-center justify-center rounded-md text-[13px] font-medium">${item}</button>`,
        )
        .join("")}
      <button type="button" aria-label="Next page" data-next
        class="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent disabled:opacity-40">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </nav>`;

  const nav = root.querySelector(`[data-pagination="${id}"]`);
  const indicator = nav.querySelector(".indicator");
  const buttons = [...nav.querySelectorAll("[data-page]")];
  const prev = nav.querySelector("[data-prev]");
  const next = nav.querySelector("[data-next]");

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function place(animated) {
    const target = buttons[current - 1];
    if (!target) return;
    const x = target.offsetLeft;
    const width = target.offsetWidth;
    if (!animated || reduce()) {
      indicator.style.transform = `translateX(${x}px)`;
      indicator.style.width = `${width}px`;
      return;
    }
    animate(indicator, { x, width }, { type: "spring", stiffness: 500, damping: 40 });
  }

  function render() {
    buttons.forEach((button, index) => {
      const item = index + 1;
      const active = item === current;
      button.setAttribute("aria-current", active ? "page" : "false");
      button.classList.toggle("text-foreground", active);
      button.classList.toggle("text-muted-foreground", !active);
    });
    prev.disabled = current === 1;
    next.disabled = current === pages;
    requestAnimationFrame(() => place(true));
  }

  function go(value) {
    current = Math.min(pages, Math.max(1, value));
    onPageChange?.(current);
    render();
  }

  buttons.forEach((button, index) => button.addEventListener("click", () => go(index + 1)));
  prev.addEventListener("click", () => go(current - 1));
  next.addEventListener("click", () => go(current + 1));
  render();
  requestAnimationFrame(() => place(false));

  return {
    get page() { return current; },
    go,
    destroy() { root.innerHTML = ""; },
  };
}

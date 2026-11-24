let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .sheet-veil { animation: veil-in 400ms cubic-bezier(0.215,0.61,0.355,1) both; }
    .sheet-panel { animation: sheet-in-right 400ms cubic-bezier(0.215,0.61,0.355,1) both; }
    .sheet-panel[data-side="left"] { animation-name: sheet-in-left; }
    @keyframes veil-in { from { opacity: 0; } }
    @keyframes sheet-in-right { from { transform: translateX(100%); } }
    @keyframes sheet-in-left { from { transform: translateX(-100%); } }
    @media (prefers-reduced-motion: reduce) { .sheet-veil, .sheet-panel { animation: sheet-fade 200ms linear both; } @keyframes sheet-fade { from { opacity: 0; } } }`;
  document.head.appendChild(style);
}

export function createSheet(root, options = {}) {
  ensureStyles();
  const {
    trigger = "Open sheet",
    title = "Workspace",
    description = "Choose where this project lives.",
    side = "right",
    content = "",
  } = options;
  const id = `sheet-${++uid}`;
  let open = false;

  root.innerHTML = `
    <button type="button" class="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium" data-sheet-trigger>${trigger}</button>`;
  const button = root.querySelector("[data-sheet-trigger]");

  function render() {
    document.querySelector(`[data-sheet="${id}"]`)?.remove();
    if (!open) return;
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-50";
    overlay.setAttribute("data-sheet", id);
    overlay.innerHTML = `<button type="button" aria-label="Close sheet"
        class="sheet-veil absolute inset-0 bg-black/20 backdrop-blur-[3px]" data-close></button>
      <div role="dialog" aria-modal="true" data-side="${side}"
        class="sheet-panel absolute top-0 flex h-full w-[85%] max-w-sm flex-col border bg-popover p-5 shadow-2xl ${side === "right" ? "right-0 border-l" : "left-0 border-r"}">
        <button type="button" aria-label="Close" data-close
          class="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <h2 class="pr-8 text-[15px] font-medium">${title}</h2>
        <p class="mt-1.5 text-[13px] leading-6 text-muted-foreground">${description}</p>
        ${content}
      </div>`;
    overlay.querySelectorAll("[data-close]").forEach((node) => {
      node.addEventListener("click", () => {
        open = false;
        render();
      });
    });
    document.body.appendChild(overlay);
  }

  button.addEventListener("click", () => {
    open = true;
    render();
  });
  const onKey = (event) => {
    if (event.key === "Escape" && open) {
      open = false;
      render();
    }
  };
  document.addEventListener("keydown", onKey);

  return {
    get open() { return open; },
    destroy() {
      document.removeEventListener("keydown", onKey);
      document.querySelector(`[data-sheet="${id}"]`)?.remove();
      root.innerHTML = "";
    },
  };
}

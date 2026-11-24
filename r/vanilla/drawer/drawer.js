let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .drawer-veil { animation: drawer-fade 400ms cubic-bezier(0.215,0.61,0.355,1) both; }
    .drawer-panel { animation: drawer-in 400ms cubic-bezier(0.34,1.2,0.64,1) both; }
    @keyframes drawer-fade { from { opacity: 0; } }
    @keyframes drawer-in { from { transform: translateX(100%); } }
    @media (prefers-reduced-motion: reduce) {
      .drawer-veil, .drawer-panel { animation: drawer-fade 200ms both; }
    }`;
  document.head.appendChild(style);
}

export function createDrawer(root, options = {}) {
  ensureStyles();
  const {
    defaultOpen = false,
    trigger = "Open drawer",
    title = "Notifications",
    description = "Updates from the projects you follow.",
    content = "",
  } = options;
  const id = `drawer-${++uid}`;
  let open = defaultOpen;
  let overlay = null;

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = trigger;
  button.className = "inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium";
  root.appendChild(button);

  function setOpen(next) {
    open = next;
    if (open) {
      overlay = document.createElement("div");
      overlay.className = "fixed inset-0 z-50";
      overlay.innerHTML = `
        <button type="button" aria-label="Close drawer" class="drawer-veil absolute inset-0 bg-background/60 backdrop-blur-sm"></button>
        <div role="dialog" aria-modal="true" class="drawer-panel absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col border-l bg-background p-5 shadow-2xl">
          <button type="button" aria-label="Close" data-close class="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <p class="text-[15px] font-medium">${title}</p>
          <p class="mt-1.5 text-[13px] leading-6 text-muted-foreground">${description}</p>
          ${content}
        </div>`;
      overlay.id = id;
      document.body.appendChild(overlay);
      overlay.querySelector(".drawer-veil").addEventListener("click", () => setOpen(false));
      overlay.querySelector("[data-close]").addEventListener("click", () => setOpen(false));
    } else {
      overlay?.remove();
      overlay = null;
    }
  }

  const onKey = (event) => {
    if (event.key === "Escape" && open) setOpen(false);
  };
  document.addEventListener("keydown", onKey);
  button.addEventListener("click", () => setOpen(true));
  if (defaultOpen) setOpen(true);

  return {
    get open() { return open; },
    setOpen,
    destroy() {
      setOpen(false);
      document.removeEventListener("keydown", onKey);
      button.remove();
    },
  };
}

let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .dialog-veil { animation: dialog-in 400ms cubic-bezier(0.215,0.61,0.355,1) both; }
    .dialog-popup { animation: dialog-pop 450ms cubic-bezier(0.23,1,0.32,1) both; }
    @keyframes dialog-in { from { opacity: 0; } }
    @keyframes dialog-pop { from { opacity: 0; transform: translateY(8px) scale(0.96); filter: blur(4px); } }
    @media (prefers-reduced-motion: reduce) {
      .dialog-veil, .dialog-popup { animation-duration: 200ms; }
      .dialog-popup { animation: dialog-in 200ms linear both; }
    }`;
  document.head.appendChild(style);
}

export function createDialog(root, options = {}) {
  ensureStyles();
  const {
    defaultOpen = false,
    trigger = "Open dialog",
    title = "Edit profile",
    description = "Make changes to your profile here.",
    content = "",
  } = options;
  const id = `dialog-${++uid}`;
  let open = defaultOpen;

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = trigger;
  button.className = "inline-flex h-8 items-center rounded-md bg-foreground px-3 text-[13px] font-medium text-background";
  root.appendChild(button);

  function setOpen(next) {
    open = next;
    if (open) {
      overlay = document.createElement("div");
      overlay.className = "fixed inset-0 z-50 flex items-center justify-center p-4";
      overlay.innerHTML = `
        <button type="button" aria-label="Close dialog" class="dialog-veil absolute inset-0 bg-background/60 backdrop-blur-sm"></button>
        <div role="dialog" aria-modal="true" class="dialog-popup relative w-full max-w-sm rounded-xl border bg-background p-5 shadow-2xl">
          <button type="button" aria-label="Close" class="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <h2 class="text-[15px] font-medium">${title}</h2>
          <p class="mt-1.5 text-[13px] leading-6 text-muted-foreground">${description}</p>
          ${content}
          <div class="mt-5 flex justify-end gap-2">
            <button type="button" data-close class="h-8 rounded-md border px-3 text-[13px]">Cancel</button>
            <button type="button" data-close class="h-8 rounded-md bg-foreground px-3 text-[13px] font-medium text-background">Save</button>
          </div>
        </div>`;
      overlay.id = id;
      document.body.appendChild(overlay);
      overlay.querySelector(".dialog-veil").addEventListener("click", () => setOpen(false));
      overlay.querySelectorAll("[data-close]").forEach((node) => node.addEventListener("click", () => setOpen(false)));
    } else {
      overlay?.remove();
      overlay = null;
    }
  }

  let overlay = null;
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

let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .alert-veil { animation: alert-in 400ms cubic-bezier(0.215,0.61,0.355,1) both; }
    .alert-popup { animation: alert-pop 450ms cubic-bezier(0.23,1,0.32,1) both; }
    @keyframes alert-in { from { opacity: 0; } }
    @keyframes alert-pop { from { opacity: 0; transform: translateY(8px) scale(0.96); filter: blur(4px); } }
    @media (prefers-reduced-motion: reduce) {
      .alert-veil, .alert-popup { animation-duration: 200ms; }
      .alert-popup { animation: alert-in 200ms linear both; }
    }`;
  document.head.appendChild(style);
}

export function createAlertDialog(root, options = {}) {
  ensureStyles();
  const {
    defaultOpen = false,
    trigger = "Delete project",
    title = "Delete project?",
    description = "This action cannot be undone. The project and its data will be removed.",
    confirmLabel = "Delete",
    onConfirm = undefined,
  } = options;
  const id = `alert-dialog-${++uid}`;
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
      overlay.className = "fixed inset-0 z-50 flex items-center justify-center p-4";
      overlay.innerHTML = `
        <button type="button" aria-label="Close dialog" class="alert-veil absolute inset-0 bg-background/60 backdrop-blur-sm"></button>
        <div role="alertdialog" aria-modal="true" class="alert-popup relative w-full max-w-sm rounded-xl border bg-background p-5 shadow-2xl">
          <h2 class="text-[15px] font-medium">${title}</h2>
          <p class="mt-1.5 text-[13px] leading-6 text-muted-foreground">${description}</p>
          <div class="mt-5 flex justify-end gap-2">
            <button type="button" data-close class="h-8 rounded-md border px-3 text-[13px]">Cancel</button>
            <button type="button" data-confirm class="h-8 rounded-md bg-destructive px-3 text-[13px] font-medium text-destructive-foreground">${confirmLabel}</button>
          </div>
        </div>`;
      overlay.id = id;
      document.body.appendChild(overlay);
      overlay.querySelector(".alert-veil").addEventListener("click", () => setOpen(false));
      overlay.querySelector("[data-close]").addEventListener("click", () => setOpen(false));
      overlay.querySelector("[data-confirm]").addEventListener("click", () => {
        onConfirm?.();
        setOpen(false);
      });
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

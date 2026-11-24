let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .toast { animation: toast-in 320ms cubic-bezier(0.34,1.36,0.64,1) both; }
    @keyframes toast-in { from { opacity: 0; transform: translate(-50%, 24px) scale(0.96); filter: blur(4px); } }
    @media (prefers-reduced-motion: reduce) { .toast { animation: toast-fade 200ms linear both; } @keyframes toast-fade { from { opacity: 0; } } }`;
  document.head.appendChild(style);
}

export function createToast(root, options = {}) {
  ensureStyles();
  const {
    trigger = "Show toast",
    title = "Changes saved",
    description = "",
    duration = 5000,
  } = options;
  const id = `toast-${++uid}`;
  let toasts = [];
  const timers = new Map();

  root.innerHTML = `
    <div class="flex w-full max-w-[420px] flex-col items-center gap-4" data-toast="${id}">
      <button type="button" data-add
        class="inline-flex h-9 items-center rounded-lg bg-foreground px-3.5 text-[13px] font-medium text-background">${trigger}</button>
      <div class="relative h-[96px] w-full" data-stack></div>
    </div>`;
  const host = root.querySelector(`[data-toast="${id}"]`);
  const stack = host.querySelector("[data-stack]");

  function dismiss(toastId) {
    const timer = timers.get(toastId);
    if (timer) clearTimeout(timer);
    timers.delete(toastId);
    toasts = toasts.filter((toast) => toast.id !== toastId);
    render();
  }
  function render() {
    stack.innerHTML = toasts
      .map(
        (toast, index) => `<div class="toast absolute bottom-4 left-1/2 flex w-[280px] -translate-x-1/2 items-center gap-2 rounded-xl border bg-popover px-3 py-2.5 text-[13px] shadow-lg"
          style="animation-delay:${index * 30}ms" data-toast-id="${toast.id}">
          <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1f9d63] text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3"><path d="M20 6 9 17l-5-5"/></svg>
          </span>
          <span class="min-w-0 flex-1"><span class="block truncate">${toast.title}</span></span>
          <button type="button" aria-label="Dismiss" data-dismiss="${toast.id}" class="shrink-0 text-muted-foreground hover:text-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>`,
      )
      .join("");
    stack.querySelectorAll("[data-dismiss]").forEach((node) => {
      node.addEventListener("click", () => dismiss(Number(node.getAttribute("data-dismiss"))));
    });
  }

  host.querySelector("[data-add]").addEventListener("click", () => {
    const toastId = Date.now();
    toasts = [...toasts, { id: toastId, title, description }].slice(-4);
    timers.set(toastId, setTimeout(() => dismiss(toastId), duration));
    render();
  });

  return {
    get count() { return toasts.length; },
    destroy() {
      for (const timer of timers.values()) clearTimeout(timer);
      timers.clear();
      root.innerHTML = "";
    },
  };
}

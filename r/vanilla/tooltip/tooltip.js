let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .tip { animation: tip-in 320ms cubic-bezier(0.23,1,0.32,1) both; }
    .tip.instant { animation-duration: 1ms; }
    @keyframes tip-in { from { opacity: 0; transform: scale(0.7); filter: blur(6px); } }
    @media (prefers-reduced-motion: reduce) { .tip { animation: tip-fade 200ms linear both; } @keyframes tip-fade { from { opacity: 0; } } }`;
  document.head.appendChild(style);
}

const store = (globalThis.__prequelTip = globalThis.__prequelTip ?? {
  open: new Set(),
  cooledAt: 0,
});

const sides = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export function createTooltip(root, options = {}) {
  ensureStyles();
  const {
    trigger = "Hover me",
    content = "Saved just now",
    side = "top",
    delay = 180,
    closeDelay = 80,
  } = options;
  const id = `tip-${++uid}`;
  const key = Symbol(id);
  let open = false;
  let instant = false;
  let openTimer;
  let closeTimer;

  root.innerHTML = `
    <span class="relative inline-flex" data-tooltip="${id}">
      <button type="button" class="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium">${trigger}</button>
    </span>`;
  const host = root.querySelector(`[data-tooltip="${id}"]`);

  function render() {
    host.querySelector(".tip")?.remove();
    if (!open) return;
    const tip = document.createElement("span");
    tip.setAttribute("role", "tooltip");
    tip.className = `tip pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[13px] font-medium text-primary-foreground shadow-md ${sides[side]}${instant ? " instant" : ""}`;
    tip.textContent = content;
    host.appendChild(tip);
  }

  function show() {
    clearTimeout(closeTimer);
    clearTimeout(openTimer);
    const warm = store.open.size > 0 || Date.now() - store.cooledAt < 300;
    instant = warm;
    openTimer = setTimeout(
      () => {
        store.open.add(key);
        open = true;
        render();
      },
      warm ? 0 : delay,
    );
  }
  function hide() {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      store.open.delete(key);
      if (store.open.size === 0) store.cooledAt = Date.now();
      open = false;
      instant = false;
      render();
    }, closeDelay);
  }

  host.addEventListener("pointerenter", show);
  host.addEventListener("pointerleave", hide);
  host.addEventListener("focusin", show);
  host.addEventListener("focusout", hide);

  return {
    get open() { return open; },
    destroy() {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
      store.open.delete(key);
      root.innerHTML = "";
    },
  };
}

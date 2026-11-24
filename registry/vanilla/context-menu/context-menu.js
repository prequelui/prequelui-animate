let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .ctx-panel { animation: ctx-in 220ms cubic-bezier(0.215,0.61,0.355,1) both; }
    .ctx-row { animation: ctx-row 200ms cubic-bezier(0.215,0.61,0.355,1) both; }
    @keyframes ctx-in { from { opacity: 0; transform: scale(0.96); } }
    @keyframes ctx-row { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
    @media (prefers-reduced-motion: reduce) { .ctx-panel, .ctx-row { animation: none; } }`;
  document.head.appendChild(style);
}

export function createContextMenu(root, options = {}) {
  ensureStyles();
  const { items = [], children = "Right click here" } = options;
  const id = `context-${++uid}`;
  let panel = null;

  root.innerHTML = `<div class="flex h-24 w-64 items-center justify-center rounded-xl border border-dashed text-[13px] text-muted-foreground"
    data-context="${id}">${children}</div>`;
  const zone = root.querySelector(`[data-context="${id}"]`);

  function close() {
    panel?.remove();
    panel = null;
  }

  zone.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    close();
    panel = document.createElement("div");
    panel.setAttribute("role", "menu");
    panel.className = "ctx-panel fixed z-50 min-w-[190px] origin-top-left rounded-xl border bg-background p-1 shadow-xl";
    panel.style.left = `${event.clientX}px`;
    panel.style.top = `${event.clientY}px`;
    panel.innerHTML = items
      .map((item, index) =>
        item.separator
          ? `<div role="separator" class="my-1 h-px bg-border"></div>`
          : `<button type="button" role="menuitem" data-index="${index}"
              class="ctx-row flex w-full items-center justify-between gap-6 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-accent"
              style="animation-delay:${index * 30}ms">
              <span>${item.label}</span>
              ${item.shortcut ? `<span class="font-mono text-[13px] text-muted-foreground">${item.shortcut}</span>` : ""}
            </button>`,
      )
      .join("");
    panel.addEventListener("pointerdown", (inner) => inner.stopPropagation());
    panel.querySelectorAll("[data-index]").forEach((node) => {
      node.addEventListener("click", () => {
        items[Number(node.getAttribute("data-index"))].onSelect?.();
        close();
      });
    });
    document.body.appendChild(panel);
  });

  const onKey = (event) => {
    if (event.key === "Escape") close();
  };
  document.addEventListener("pointerdown", close);
  document.addEventListener("keydown", onKey);

  return {
    close,
    destroy() {
      close();
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", onKey);
      root.innerHTML = "";
    },
  };
}

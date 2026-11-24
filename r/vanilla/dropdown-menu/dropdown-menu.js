let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .menu-panel { animation: menu-in 220ms cubic-bezier(0.215,0.61,0.355,1) both; }
    .menu-item { animation: menu-item-in 220ms cubic-bezier(0.215,0.61,0.355,1) both; }
    @keyframes menu-in { from { opacity: 0; } }
    @keyframes menu-item-in { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
    @media (prefers-reduced-motion: reduce) { .menu-panel, .menu-item { animation: none; } }`;
  document.head.appendChild(style);
}

export function createDropdownMenu(root, options = {}) {
  ensureStyles();
  const { trigger = "Actions", items = [], align = "start" } = options;
  const id = `dropdown-${++uid}`;
  let open = false;
  root.innerHTML = `
    <div class="relative inline-block" data-dropdown="${id}">
      <button type="button" aria-haspopup="menu" aria-expanded="false"
        class="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-[13px] font-medium">
        ${trigger}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5 text-muted-foreground"><path d="m6 9 6 6 6-6"/></svg>
      </button>
    </div>`;
  const host = root.querySelector(`[data-dropdown="${id}"]`);
  const button = host.querySelector("button");

  function render() {
    host.querySelector("[role=menu]")?.remove();
    button.setAttribute("aria-expanded", String(open));
    if (!open) return;
    const menu = document.createElement("div");
    menu.setAttribute("role", "menu");
    menu.className = `menu-panel absolute top-full z-40 mt-1.5 min-w-[190px] rounded-xl border bg-background p-1 shadow-xl ${align === "end" ? "right-0" : "left-0"}`;
    menu.innerHTML = items
      .map((item, index) =>
        item.separator
          ? `<div role="separator" class="my-1 h-px bg-border"></div>`
          : `<button type="button" role="menuitem" data-index="${index}"
              class="menu-item flex w-full items-center justify-between gap-6 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-accent"
              style="animation-delay:${index * 30}ms">
              <span>${item.label}</span>
              ${item.shortcut ? `<span class="font-mono text-[13px] text-muted-foreground">${item.shortcut}</span>` : ""}
            </button>`,
      )
      .join("");
    menu.querySelectorAll("[data-index]").forEach((node) => {
      node.addEventListener("click", () => {
        const index = Number(node.getAttribute("data-index"));
        items[index].onSelect?.();
        open = false;
        render();
      });
    });
    host.appendChild(menu);
  }

  button.addEventListener("click", () => {
    open = !open;
    render();
  });
  const onPointer = (event) => {
    if (open && !host.contains(event.target)) {
      open = false;
      render();
    }
  };
  const onKey = (event) => {
    if (event.key === "Escape" && open) {
      open = false;
      render();
    }
  };
  document.addEventListener("pointerdown", onPointer);
  document.addEventListener("keydown", onKey);

  return {
    get open() { return open; },
    destroy() {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      root.innerHTML = "";
    },
  };
}

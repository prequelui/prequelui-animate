let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .mb-panel { animation: mb-in 220ms cubic-bezier(0.215,0.61,0.355,1) both; }
    .mb-row { animation: mb-row 200ms cubic-bezier(0.215,0.61,0.355,1) both; }
    @keyframes mb-in { from { opacity: 0; } }
    @keyframes mb-row { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
    @media (prefers-reduced-motion: reduce) { .mb-panel, .mb-row { animation: none; } }`;
  document.head.appendChild(style);
}

export function createMenubar(root, options = {}) {
  ensureStyles();
  const {
    menus = [
      { label: "File", items: [{ label: "New file", shortcut: "⌘N" }, { label: "Open", shortcut: "⌘O" }, { separator: true, label: "sep" }, { label: "Save", shortcut: "⌘S" }] },
      { label: "Edit", items: [{ label: "Undo", shortcut: "⌘Z" }, { label: "Redo", shortcut: "⇧⌘Z" }] },
      { label: "View", items: [{ label: "Zoom in" }, { label: "Zoom out" }] },
    ],
  } = options;
  const id = `menubar-${++uid}`;
  let open = null;

  root.innerHTML = `
    <div role="menubar" class="flex items-center gap-1 rounded-lg border p-1" data-menubar="${id}">
      ${menus
        .map(
          (menu, index) => `<div class="relative" data-menu="${index}">
            <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false"
              class="h-7 rounded-md px-2.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground">${menu.label}</button>
          </div>`,
        )
        .join("")}
    </div>`;
  const bar = root.querySelector(`[data-menubar="${id}"]`);

  function render() {
    bar.querySelectorAll("[data-menu]").forEach((host, index) => {
      const button = host.querySelector("button");
      const active = open === index;
      button.setAttribute("aria-expanded", String(active));
      button.classList.toggle("bg-accent", active);
      button.classList.toggle("text-foreground", active);
      button.classList.toggle("text-muted-foreground", !active);
      host.querySelector("[role=menu]")?.remove();
      if (!active) return;
      const menu = menus[index];
      const panel = document.createElement("div");
      panel.setAttribute("role", "menu");
      panel.className = "mb-panel absolute left-0 top-full z-40 mt-1 min-w-[190px] rounded-xl border bg-background p-1 shadow-xl";
      panel.innerHTML = menu.items
        .map((item, itemIndex) =>
          item.separator
            ? `<div role="separator" class="my-1 h-px bg-border"></div>`
            : `<button type="button" role="menuitem" data-menu-item="${itemIndex}"
                class="mb-row flex w-full items-center justify-between gap-6 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-accent"
                style="animation-delay:${itemIndex * 30}ms">
                <span>${item.label}</span>
                ${item.shortcut ? `<span class="font-mono text-[13px] text-muted-foreground">${item.shortcut}</span>` : ""}
              </button>`,
        )
        .join("");
      panel.querySelectorAll("[data-menu-item]").forEach((node) => {
        node.addEventListener("click", () => {
          menu.items[Number(node.getAttribute("data-menu-item"))].onSelect?.();
          open = null;
          render();
        });
      });
      host.appendChild(panel);
    });
  }

  bar.querySelectorAll("[data-menu]").forEach((host, index) => {
    const button = host.querySelector("button");
    button.addEventListener("click", () => {
      open = open === index ? null : index;
      render();
    });
    button.addEventListener("pointerenter", () => {
      if (open === null) return;
      open = index;
      render();
    });
  });

  const onPointer = (event) => {
    if (open !== null && !bar.contains(event.target)) {
      open = null;
      render();
    }
  };
  const onKey = (event) => {
    if (event.key === "Escape" && open !== null) {
      open = null;
      render();
    }
  };
  document.addEventListener("pointerdown", onPointer);
  document.addEventListener("keydown", onKey);
  render();

  return {
    get open() { return open; },
    destroy() {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      root.innerHTML = "";
    },
  };
}

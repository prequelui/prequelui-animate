let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .pop { animation: pop-in 320ms cubic-bezier(0.23,1,0.32,1) both; }
    @keyframes pop-in { from { opacity: 0; transform: scale(0.8); } }
    @media (prefers-reduced-motion: reduce) { .pop { animation: pop-fade 150ms linear both; } @keyframes pop-fade { from { opacity: 0; } } }`;
  document.head.appendChild(style);
}

export function createPopover(root, options = {}) {
  ensureStyles();
  const {
    trigger = "Share project",
    title = "Anyone with the link",
    description = "People with the link can view this project but cannot edit it.",
    side = "bottom",
    content = "",
  } = options;
  const id = `popover-${++uid}`;
  let open = false;

  root.innerHTML = `
    <div class="relative inline-block" data-popover="${id}">
      <button type="button" aria-haspopup="dialog" aria-expanded="false"
        class="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium">${trigger}</button>
    </div>`;
  const host = root.querySelector(`[data-popover="${id}"]`);
  const button = host.querySelector("button");

  function render() {
    host.querySelector(".pop")?.remove();
    button.setAttribute("aria-expanded", String(open));
    if (!open) return;
    const panel = document.createElement("div");
    panel.setAttribute("role", "dialog");
    panel.className = `pop absolute left-0 z-40 w-64 rounded-xl border bg-popover p-3 text-popover-foreground shadow-xl ${side === "top" ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"}`;
    panel.innerHTML = `<p class="text-[13px] font-medium">${title}</p>
      <p class="mt-1 text-[13px] leading-5 text-muted-foreground">${description}</p>${content}`;
    host.appendChild(panel);
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

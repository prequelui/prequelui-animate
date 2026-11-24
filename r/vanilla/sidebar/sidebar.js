let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .side-label { animation: side-label-in 140ms cubic-bezier(0.23,1,0.32,1) both; }
    @keyframes side-label-in { from { opacity: 0; filter: blur(2px); transform: translateX(-4px); } }
    @media (prefers-reduced-motion: reduce) { .side-label { animation: side-label-fade 140ms linear both; } @keyframes side-label-fade { from { opacity: 0; } } }`;
  document.head.appendChild(style);
}

export function createSidebar(root, options = {}) {
  ensureStyles();
  const {
    items = [
      { value: "home", label: "Home" },
      { value: "projects", label: "Projects" },
      { value: "team", label: "Team" },
      { value: "settings", label: "Settings" },
    ],
    defaultValue = "projects",
    defaultCollapsed = false,
    onValueChange = undefined,
    onCollapsedChange = undefined,
  } = options;
  const id = `sidebar-${++uid}`;
  let current = defaultValue;
  let closed = defaultCollapsed;

  root.innerHTML = `<div class="flex h-[190px] w-full max-w-[320px] overflow-hidden rounded-xl border bg-background" data-sidebar="${id}"></div>`;
  const host = root.querySelector(`[data-sidebar="${id}"]`);

  function render() {
    const active = items.find((item) => item.value === current) ?? items[0];
    host.innerHTML = `
      <div class="flex shrink-0 flex-col overflow-hidden border-r bg-accent/40 p-2 transition-[width] duration-[280ms] ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none"
        style="width:${closed ? 54 : 136}px">
        <div class="mb-3 flex h-7 items-center gap-2 overflow-hidden px-1">
          <span class="flex size-5 shrink-0 items-center justify-center rounded-md bg-foreground text-[12px] font-medium text-background">P</span>
          ${closed ? "" : '<span class="side-label whitespace-nowrap text-[13px] font-medium">Prequel</span>'}
        </div>
        ${items
          .map(
            (item) => `<button type="button" aria-pressed="${item.value === current}" data-value="${item.value}"
              class="relative mb-0.5 flex h-7 items-center gap-2 overflow-hidden rounded-md px-2 text-[13px] transition-colors ${item.value === current ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}">
              <span class="relative shrink-0"><span class="block size-1.5 rounded-full bg-current"></span></span>
              ${closed ? "" : `<span class="side-label relative whitespace-nowrap">${item.label}</span>`}
            </button>`,
          )
          .join("")}
      </div>
      <div class="flex min-w-0 flex-1 flex-col p-3">
        <div class="flex items-center justify-between">
          <p class="truncate text-[13px] font-medium">${active.label}</p>
          <button type="button" aria-label="Toggle sidebar" aria-expanded="${!closed}" data-toggle
            class="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
          </button>
        </div>
        <div class="mt-3 space-y-2">
          ${[70, 92, 58]
            .map(
              (width) => `<div class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-border"></span>
                <span class="h-1.5 rounded-full bg-accent" style="width:${width}%"></span></div>`,
            )
            .join("")}
        </div>
      </div>`;
    host.querySelectorAll("[data-value]").forEach((node) => {
      node.addEventListener("click", () => {
        current = node.getAttribute("data-value");
        onValueChange?.(current);
        render();
      });
    });
    host.querySelector("[data-toggle]").addEventListener("click", () => {
      closed = !closed;
      onCollapsedChange?.(closed);
      render();
    });
  }
  render();

  return {
    get value() { return current; },
    get collapsed() { return closed; },
    destroy() {
      root.innerHTML = "";
    },
  };
}

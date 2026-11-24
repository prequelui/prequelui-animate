let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .nav-panel { animation: nav-in 240ms cubic-bezier(0.215,0.61,0.355,1) both; }
    .nav-content { animation: nav-content 200ms cubic-bezier(0.215,0.61,0.355,1) both; }
    @keyframes nav-in { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
    @keyframes nav-content { from { opacity: 0; transform: translateX(6px); } }
    @media (prefers-reduced-motion: reduce) { .nav-panel, .nav-content { animation: none; } }`;
  document.head.appendChild(style);
}

export function createNavigationMenu(root, options = {}) {
  ensureStyles();
  const {
    items = [
      { label: "Components", content: "Every primitive, with the same motion contract." },
      { label: "Templates", content: "Full pages built on the same tokens." },
      { label: "Docs", content: "Installation, accessibility and API references." },
    ],
  } = options;
  const id = `nav-${++uid}`;
  let open = null;
  let timer;

  root.innerHTML = `
    <div class="relative w-full max-w-sm" data-nav="${id}">
      <div role="menubar" class="flex items-center gap-1 rounded-lg border p-1">
        ${items
          .map(
            (item, index) => `<button type="button" data-trigger="${index}" aria-expanded="false"
              class="flex h-7 items-center gap-1 rounded-md px-2.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground">
              ${item.label}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3 transition-transform"><path d="m6 9 6 6 6-6"/></svg>
            </button>`,
          )
          .join("")}
      </div>
    </div>`;
  const host = root.querySelector(`[data-nav="${id}"]`);
  const triggers = [...host.querySelectorAll("[data-trigger]")];

  function render() {
    host.querySelector(".nav-panel")?.remove();
    triggers.forEach((trigger, index) => {
      const active = open === index;
      trigger.setAttribute("aria-expanded", String(active));
      trigger.classList.toggle("bg-accent", active);
      trigger.classList.toggle("text-foreground", active);
      trigger.classList.toggle("text-muted-foreground", !active);
      trigger.querySelector("svg").style.transform = `rotate(${active ? 180 : 0}deg)`;
    });
    if (open === null) return;
    const panel = document.createElement("div");
    panel.className = "nav-panel absolute left-0 top-full z-40 mt-1.5 w-full overflow-hidden rounded-xl border bg-background p-4 shadow-xl";
    panel.innerHTML = `<div class="nav-content text-[13px] leading-6 text-muted-foreground">${items[open].content}</div>`;
    host.appendChild(panel);
  }

  triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => {
      open = open === index ? null : index;
      render();
    });
    trigger.addEventListener("pointerenter", () => {
      open = index;
      render();
    });
  });

  host.addEventListener("pointerleave", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      open = null;
      render();
    }, 180);
  });
  host.addEventListener("pointerenter", () => clearTimeout(timer));

  const onPointer = (event) => {
    if (open !== null && !host.contains(event.target)) {
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
      clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      root.innerHTML = "";
    },
  };
}

let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .tab-panel { animation: tab-in 300ms cubic-bezier(0.25,0.1,0.35,1) both; }
    @keyframes tab-in { from { opacity: 0; transform: translateX(12px); filter: blur(5px); } }
    @media (prefers-reduced-motion: reduce) { .tab-panel { animation: tab-fade 200ms linear both; } @keyframes tab-fade { from { opacity: 0; } } }`;
  document.head.appendChild(style);
}

export function createTabs(root, options = {}) {
  ensureStyles();
  const {
    items = [
      { value: "overview", label: "Overview", content: "A calm summary of the workspace, its members and the latest activity." },
      { value: "activity", label: "Activity", content: "Every change, in order. Hover a row to see who made it and when." },
      { value: "settings", label: "Settings", content: "Name, visibility and notification preferences for this project." },
    ],
    defaultValue = "",
    onValueChange = undefined,
  } = options;
  const id = `tabs-${++uid}`;
  let current = defaultValue || items[0]?.value || "";

  root.innerHTML = `
    <div class="w-full max-w-[460px]" data-tabs="${id}">
      <div role="tablist" aria-label="Tabs" class="relative flex items-center gap-1 rounded-lg bg-accent p-1">
        <span aria-hidden="true" data-indicator
          class="absolute inset-y-1 rounded-md bg-background shadow-sm transition-[left,width] duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:transition-none"></span>
        ${items
          .map(
            (item) => `<button type="button" role="tab" data-value="${item.value}" tabindex="-1"
              class="relative flex-1 rounded-md px-3 py-1.5 text-[13px] outline-none transition-colors duration-200">${item.label}</button>`,
          )
          .join("")}
      </div>
      <div class="relative mt-4 min-h-[72px] overflow-hidden" data-panel></div>
    </div>`;
  const host = root.querySelector(`[data-tabs="${id}"]`);
  const list = host.querySelector('[role="tablist"]');
  const indicator = host.querySelector("[data-indicator]");
  const panelHost = host.querySelector("[data-panel]");
  const buttons = [...list.querySelectorAll("[data-value]")];

  function render() {
    const index = items.findIndex((item) => item.value === current);
    const active = items[index] ?? items[0];
    buttons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
      button.classList.toggle("text-foreground", selected);
      button.classList.toggle("text-muted-foreground", !selected);
      button.classList.toggle("hover:text-foreground", !selected);
    });
    const node = buttons[index];
    if (node) {
      indicator.style.left = `${node.offsetLeft}px`;
      indicator.style.width = `${node.offsetWidth}px`;
    }
    panelHost.innerHTML = `<div role="tabpanel" class="tab-panel rounded-lg border bg-background p-4 text-[13px] leading-6 text-muted-foreground outline-none">${active?.content ?? ""}</div>`;
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      current = button.getAttribute("data-value");
      onValueChange?.(current);
      render();
    });
    button.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = (index + direction + items.length) % items.length;
      current = items[next].value;
      onValueChange?.(current);
      render();
      buttons[next]?.focus();
    });
  });
  render();

  return {
    get value() { return current; },
    destroy() {
      root.innerHTML = "";
    },
  };
}

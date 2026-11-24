let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .select-panel { animation: select-in 220ms cubic-bezier(0.215,0.61,0.355,1) both; }
    .select-row { animation: select-row 220ms cubic-bezier(0.215,0.61,0.355,1) both; }
    @keyframes select-in { from { opacity: 0; transform: scale(0.9); } }
    @keyframes select-row { from { opacity: 0; transform: translateY(-4px); } }
    @media (prefers-reduced-motion: reduce) { .select-panel, .select-row { animation: select-fade 150ms linear both; } @keyframes select-fade { from { opacity: 0; } } }`;
  document.head.appendChild(style);
}

export function createSelect(root, options = {}) {
  ensureStyles();
  const {
    items = ["Design", "Engineering", "Marketing", "Support"],
    defaultValue = "",
    placeholder = "Select an option",
    onValueChange = undefined,
  } = options;
  const id = `select-${++uid}`;
  const optionsList = items.map((item) =>
    typeof item === "string" ? { value: item, label: item } : item,
  );
  let current = defaultValue;
  let open = false;
  let active = 0;

  root.innerHTML = `
    <div class="relative w-[220px] text-[13px]" data-select="${id}">
      <button type="button" aria-haspopup="listbox" aria-expanded="false"
        class="flex h-9 w-full items-center justify-between rounded-lg border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
        <span data-label></span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5 text-muted-foreground"><path d="m6 9 6 6 6-6"/></svg>
      </button>
    </div>`;
  const host = root.querySelector(`[data-select="${id}"]`);
  const button = host.querySelector("button");
  const output = host.querySelector("[data-label]");

  function render() {
    const selected = optionsList.find((option) => option.value === current);
    output.textContent = selected ? selected.label : placeholder;
    output.className = selected ? "" : "text-muted-foreground";
    button.setAttribute("aria-expanded", String(open));
    host.querySelector(".select-panel")?.remove();
    if (!open) return;
    const panel = document.createElement("div");
    panel.setAttribute("role", "listbox");
    panel.className = "select-panel absolute left-0 top-full z-40 mt-1.5 w-full origin-top rounded-xl border bg-popover p-1 shadow-lg";
    panel.innerHTML = optionsList
      .map(
        (option, index) => `<button type="button" role="option" aria-selected="${option.value === current}" data-index="${index}"
          class="select-row flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-accent ${option.value === current ? "text-foreground" : "text-muted-foreground"}"
          style="animation-delay:${index * 30}ms"><span>${option.label}</span>
          ${option.value === current ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5"><path d="M20 6 9 17l-5-5"/></svg>' : ""}
        </button>`,
      )
      .join("");
    panel.querySelectorAll("[data-index]").forEach((node) => {
      node.addEventListener("click", () => {
        const option = optionsList[Number(node.getAttribute("data-index"))];
        current = option.value;
        open = false;
        onValueChange?.(current);
        render();
      });
    });
    host.appendChild(panel);
  }

  function onKey(event) {
    if (event.key === "Escape") {
      open = false;
      render();
      return;
    }
    if (!open && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
      event.preventDefault();
      open = true;
      render();
      return;
    }
    if (!open) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      active = Math.min(optionsList.length - 1, active + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      active = Math.max(0, active - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = optionsList[active];
      if (option) {
        current = option.value;
        open = false;
        onValueChange?.(current);
        render();
      }
    }
  }

  button.addEventListener("click", () => {
    open = !open;
    render();
  });
  host.addEventListener("keydown", onKey);
  const onPointer = (event) => {
    if (open && !host.contains(event.target)) {
      open = false;
      render();
    }
  };
  document.addEventListener("pointerdown", onPointer);
  render();

  return {
    get value() { return current; },
    destroy() {
      document.removeEventListener("pointerdown", onPointer);
      root.innerHTML = "";
    },
  };
}

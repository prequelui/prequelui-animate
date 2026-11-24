let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .combo-panel { animation: combo-in 220ms cubic-bezier(0.215,0.61,0.355,1) both; }
    .combo-row { animation: combo-row 200ms cubic-bezier(0.215,0.61,0.355,1) both; }
    @keyframes combo-in { from { opacity: 0; transform: translateY(-4px); } }
    @keyframes combo-row { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
    @media (prefers-reduced-motion: reduce) { .combo-panel, .combo-row { animation: none; } }`;
  document.head.appendChild(style);
}

export function createCombobox(root, options = {}) {
  ensureStyles();
  const {
    options: list = [
      { value: "base-ui", label: "Base UI" },
      { value: "radix-ui", label: "Radix UI" },
      { value: "react-aria", label: "React Aria" },
      { value: "reka-ui", label: "Reka UI" },
    ],
    placeholder = "Pick a library",
    defaultValue = "",
    onChange = undefined,
  } = options;
  const id = `combobox-${++uid}`;
  let query = defaultValue;
  let value = defaultValue;
  let open = false;
  let active = 0;

  root.innerHTML = `
    <div class="relative w-56 text-[13px]" data-combobox="${id}">
      <div class="flex h-9 items-center rounded-lg border bg-background px-2.5">
        <input role="combobox" aria-expanded="false" aria-controls="${id}-list" aria-autocomplete="list"
          value="${query}" placeholder="${placeholder}"
          class="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4 shrink-0 text-muted-foreground"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>`;
  const host = root.querySelector(`[data-combobox="${id}"]`);
  const input = host.querySelector("input");

  const filtered = () => list.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

  function render() {
    host.querySelector("ul")?.remove();
    input.setAttribute("aria-expanded", String(open));
    if (!open) return;
    const ul = document.createElement("ul");
    ul.id = `${id}-list`;
    ul.setAttribute("role", "listbox");
    ul.className = "combo-panel absolute top-full z-40 mt-1.5 w-full rounded-xl border bg-background p-1 shadow-xl";
    const rows = filtered();
    ul.innerHTML = rows.length
      ? rows
          .map(
            (option, index) => `<li role="option" data-value="${option.value}" aria-selected="${option.value === value}"
              class="combo-row relative flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5"
              style="animation-delay:${index * 30}ms">
              ${option.label}${option.value === value ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5"><path d="M20 6 9 17l-5-5"/></svg>` : ""}
            </li>`,
          )
          .join("")
      : `<li class="px-2 py-2 text-muted-foreground">No result</li>`;
    ul.querySelectorAll("[data-value]").forEach((row) => {
      const option = list.find((entry) => entry.value === row.getAttribute("data-value"));
      row.addEventListener("pointerenter", () => {
        active = rows.indexOf(option);
      });
      row.addEventListener("click", () => choose(option));
    });
    host.appendChild(ul);
  }

  function choose(option) {
    value = option.value;
    query = option.label;
    input.value = option.label;
    open = false;
    render();
    onChange?.(option.value);
  }

  input.addEventListener("input", () => {
    query = input.value;
    open = true;
    active = 0;
    render();
  });
  input.addEventListener("focus", () => {
    open = true;
    render();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      open = false;
      render();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      open = true;
      active = Math.min(filtered().length - 1, active + 1);
      render();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      active = Math.max(0, active - 1);
    } else if (event.key === "Enter" && filtered()[active]) {
      choose(filtered()[active]);
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (open && !host.contains(event.target)) {
      open = false;
      render();
    }
  });

  return {
    get value() { return value; },
    destroy() { root.innerHTML = ""; },
  };
}

let uid = 0;

export function createToggleGroup(root, options = {}) {
  const {
    items = ["day", "week", "month"],
    type = "single",
    defaultValue = undefined,
    onValueChange = undefined,
  } = options;
  const id = `toggle-group-${++uid}`;
  const initialValue =
    defaultValue !== undefined && !Array.isArray(defaultValue) && type === "multiple"
      ? [defaultValue]
      : defaultValue;
  const optionsList = items.map((item) =>
    typeof item === "string" ? { value: item, label: item } : item,
  );
  let selected =
    initialValue === undefined
      ? [optionsList[0]?.value].filter(Boolean)
      : Array.isArray(initialValue)
        ? [...initialValue]
        : [initialValue];

  root.innerHTML = `
    <div role="group" class="relative flex items-center rounded-lg bg-accent p-1" data-toggle-group="${id}">
      <span aria-hidden="true" data-indicator
        class="absolute inset-y-1 rounded-md bg-background shadow-sm transition-[left,width] duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:transition-none"></span>
      ${optionsList
        .map(
          (item) => `<button type="button" data-value="${item.value}"
            class="relative rounded-md px-3 py-1.5 text-[13px] capitalize transition-[color,background-color,transform] duration-200 active:scale-[0.97]">${item.label}</button>`,
        )
        .join("")}
    </div>`;
  const host = root.querySelector(`[data-toggle-group="${id}"]`);
  const indicator = host.querySelector("[data-indicator]");
  const buttons = [...host.querySelectorAll("[data-value]")];

  function render() {
    buttons.forEach((button, index) => {
      const item = optionsList[index];
      const active = selected.includes(item.value);
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("text-foreground", active);
      button.classList.toggle("text-muted-foreground", !active);
      button.classList.toggle("hover:text-foreground", !active);
      button.classList.toggle("bg-background", type === "multiple" && active);
      button.classList.toggle("shadow-sm", type === "multiple" && active);
    });
    if (type === "single") {
      const index = optionsList.findIndex((item) => selected.includes(item.value));
      const node = buttons[index];
      if (node) {
        indicator.style.left = `${node.offsetLeft}px`;
        indicator.style.width = `${node.offsetWidth}px`;
        indicator.style.opacity = "1";
      } else {
        indicator.style.opacity = "0";
      }
    } else {
      indicator.style.opacity = "0";
    }
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const value = optionsList[index].value;
      if (type === "multiple") {
        selected = selected.includes(value)
          ? selected.filter((entry) => entry !== value)
          : [...selected, value];
      } else {
        selected = selected.includes(value) ? [] : [value];
      }
      onValueChange?.(type === "single" ? (selected[0] ?? "") : [...selected]);
      render();
    });
  });
  render();

  return {
    get value() { return type === "single" ? (selected[0] ?? "") : [...selected]; },
    destroy() {
      root.innerHTML = "";
    },
  };
}

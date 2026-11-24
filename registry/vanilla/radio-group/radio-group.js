let uid = 0;

export function createRadioGroup(root, options = {}) {
  const {
    items = [
      { value: "standard", label: "Standard", hint: "5–7 business days" },
      { value: "express", label: "Express", hint: "2–3 business days" },
      { value: "overnight", label: "Overnight", hint: "Next business day" },
    ],
    defaultValue = "standard",
    onValueChange = undefined,
  } = options;
  const id = `radio-${++uid}`;
  let current = defaultValue;

  root.innerHTML = `<div role="radiogroup" class="flex flex-col gap-2" data-radio="${id}"></div>`;
  const host = root.querySelector(`[data-radio="${id}"]`);

  function render() {
    host.innerHTML = items
      .map(
        (item) => `<button type="button" role="radio" aria-checked="${item.value === current}"
          data-value="${item.value}"
          class="flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5 text-left text-[13px] transition-[background-color,transform] duration-200 hover:bg-accent active:scale-[0.97]">
          <span class="flex size-4 items-center justify-center rounded-full border">
            <span aria-hidden="true" class="size-2 rounded-full bg-foreground transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
              style="transform:scale(${item.value === current ? 1 : 0})"></span>
          </span>
          <span class="flex-1">${item.label}</span>
          ${item.hint ? `<span class="text-[13px] text-muted-foreground">${item.hint}</span>` : ""}
        </button>`,
      )
      .join("");
    host.querySelectorAll("[data-value]").forEach((node) => {
      node.addEventListener("click", () => {
        current = node.getAttribute("data-value");
        onValueChange?.(current);
        render();
      });
    });
  }
  render();

  return {
    get value() { return current; },
    destroy() {
      root.innerHTML = "";
    },
  };
}

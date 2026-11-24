let uid = 0;

export function createCheckbox(root, options = {}) {
  const { defaultChecked = false, label = "Accept terms" } = options;
  const id = `checkbox-${++uid}`;
  let value = defaultChecked;
  root.innerHTML = `
    <label class="flex items-center gap-2.5 text-[13px]">
      <button type="button" role="checkbox" aria-checked="${value}" id="${id}"
        class="relative flex size-4 items-center justify-center rounded-[4px] border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${value ? "border-foreground" : "border-input"}">
        <span aria-hidden="true" class="absolute inset-0 rounded-[3px] bg-foreground transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
          style="transform:scale(${value ? 1 : 0.5});opacity:${value ? 1 : 0}"></span>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="relative size-3 text-background">
          <path d="m5 12 4 4L19 6"
            style="stroke-dasharray:20;stroke-dashoffset:${value ? 0 : 20};transition:stroke-dashoffset .25s cubic-bezier(0.23,1,0.32,1)"></path>
        </svg>
      </button>
      <span>${label}</span>
    </label>`;

  const button = root.querySelector("button");
  const fill = root.querySelector("span[aria-hidden]");
  const path = root.querySelector("path");

  function render() {
    button.setAttribute("aria-checked", String(value));
    button.classList.toggle("border-foreground", value);
    button.classList.toggle("border-input", !value);
    fill.style.transform = `scale(${value ? 1 : 0.5})`;
    fill.style.opacity = value ? "1" : "0";
    path.style.strokeDashoffset = value ? "0" : "20";
  }

  button.addEventListener("click", () => {
    value = !value;
    render();
    options.onCheckedChange?.(value);
  });

  return { get checked() { return value; }, destroy() { root.innerHTML = ""; } };
}

let uid = 0;

export function createSwitch(root, options = {}) {
  const {
    defaultChecked = false,
    label = "Enable notifications",
    onCheckedChange = undefined,
  } = options;
  const id = `switch-${++uid}`;
  let checked = defaultChecked;

  root.innerHTML = `
    <label class="flex items-center gap-3 text-[13px]">
      <button type="button" role="switch" aria-label="${label}" aria-checked="${checked}"
        class="relative flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/50">
        <span aria-hidden="true" data-thumb
          class="block h-5 rounded-full bg-background shadow-sm transition-[transform,width] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"></span>
      </button>
      <span>${label}</span>
    </label>`;
  const button = root.querySelector("button");
  const thumb = root.querySelector("[data-thumb]");

  function render() {
    button.setAttribute("aria-checked", String(checked));
    button.classList.toggle("bg-primary", checked);
    button.classList.toggle("bg-input", !checked);
    thumb.style.transform = `translateX(${checked ? 20 : 0}px)`;
  }
  render();

  button.addEventListener("click", () => {
    checked = !checked;
    onCheckedChange?.(checked);
    render();
  });
  button.addEventListener("pointerdown", () => {
    thumb.style.width = "24px";
  });
  button.addEventListener("pointerup", () => {
    thumb.style.width = "20px";
  });
  button.addEventListener("pointerleave", () => {
    thumb.style.width = "20px";
  });

  return {
    get checked() { return checked; },
    destroy() {
      root.innerHTML = "";
    },
  };
}

let uid = 0;

export function createToggle(root, options = {}) {
  const { defaultPressed = false, label = "Live preview", onPressedChange = undefined } = options;
  const id = `toggle-${++uid}`;
  let pressed = defaultPressed;

  root.innerHTML = `
    <button type="button" aria-pressed="${pressed}"
      class="relative inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-[13px] font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.97]">
      <span aria-hidden="true" data-dot class="block size-2 rounded-full transition-colors duration-200"></span>
      <span>${label}</span>
    </button>`;
  const button = root.querySelector("button");
  const dot = root.querySelector("[data-dot]");

  function render() {
    button.setAttribute("aria-pressed", String(pressed));
    button.classList.toggle("bg-primary", pressed);
    button.classList.toggle("text-primary-foreground", pressed);
    button.classList.toggle("bg-background", !pressed);
    button.classList.toggle("text-muted-foreground", !pressed);
    button.classList.toggle("hover:bg-accent", !pressed);
    dot.classList.toggle("bg-[#7ee2a8]", pressed);
    dot.classList.toggle("bg-muted-foreground/50", !pressed);
  }
  render();

  button.addEventListener("click", () => {
    pressed = !pressed;
    onPressedChange?.(pressed);
    render();
  });

  return {
    get pressed() { return pressed; },
    destroy() {
      root.innerHTML = "";
    },
  };
}

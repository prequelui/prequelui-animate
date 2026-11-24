import { animate } from "motion";

const SUN =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute inset-0 size-4 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
const MOON =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute inset-0 size-4 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
const MONITOR =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute inset-0 size-4 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>';

export function createThemeTogglerButton(root, options = {}) {
  const {
    theme = "light",
    resolvedTheme = "light",
    modes = ["light", "dark", "system"],
    onThemeChange = undefined,
    className = "",
  } = options;
  let current = theme;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.innerHTML = `
    <button type="button" data-slot="theme-toggler-button"
      class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border bg-background px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${className}">
      <span class="relative inline-flex size-4 items-center justify-center">
        <span data-icon="light">${SUN}</span>
        <span data-icon="dark">${MOON}</span>
        <span data-icon="system">${MONITOR}</span>
      </span>
      <span data-label>${current}</span>
    </button>`;
  const button = root.querySelector("button");
  const label = root.querySelector("[data-label]");
  const icons = {
    light: root.querySelector('[data-icon="light"] svg'),
    dark: root.querySelector('[data-icon="dark"] svg'),
    system: root.querySelector('[data-icon="system"] svg'),
  };

  function nextTheme() {
    let index = modes.indexOf(current);
    if (index === -1) index = modes.indexOf(resolvedTheme);
    if (index === -1) return modes[0] ?? resolvedTheme;
    return modes[(index + 1) % modes.length];
  }

  function render() {
    button.dataset.theme = current;
    label.textContent = current;
    for (const [name, icon] of Object.entries(icons)) {
      const active = current === name;
      icon.classList.toggle("rotate-0", active);
      icon.classList.toggle("scale-100", active);
      icon.classList.toggle("opacity-100", active);
      icon.classList.toggle("blur-0", active);
      icon.classList.toggle("-rotate-90", !active);
      icon.classList.toggle("scale-50", !active);
      icon.classList.toggle("opacity-0", !active);
      icon.classList.toggle("blur-[2px]", !active);
    }
    button.setAttribute("aria-label", `Switch to ${nextTheme()} theme`);
  }

  function press() {
    if (reduce()) return;
    animate(
      button,
      { scale: 0.97 },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  }

  function release() {
    if (reduce()) return;
    animate(
      button,
      { scale: 1 },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  }

  function click() {
    current = nextTheme();
    onThemeChange?.(current);
    render();
  }

  render();
  button.addEventListener("click", click);
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointerleave", release);

  return {
    element: button,
    get theme() { return current; },
    destroy() {
      button.removeEventListener("click", click);
      button.removeEventListener("pointerdown", press);
      button.removeEventListener("pointerup", release);
      button.removeEventListener("pointerleave", release);
      root.innerHTML = "";
    },
  };
}

import { animate } from "motion";

const COPY_ICON =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute inset-0 size-4 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:scale-100 motion-reduce:transition-none"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const CHECK_ICON =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute inset-0 size-4 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:scale-100 motion-reduce:transition-none"><path d="M20 6 9 17l-5-5"/></svg>';

export function createCopyButton(root, options = {}) {
  const {
    content = "",
    label = "Copy",
    copiedLabel = "Copied",
    defaultCopied = false,
    delay = 3000,
    onCopiedChange = undefined,
  } = options;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let copied = defaultCopied;
  let timer;

  root.innerHTML = `
    <button type="button" data-slot="copy-button"
      class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border bg-background px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
      <span data-slot="copy-button-icon" class="relative inline-flex size-4 items-center justify-center">
        <span data-icon="copy">${COPY_ICON}</span>
        <span data-icon="check">${CHECK_ICON}</span>
      </span>
      <span data-label>${label}</span>
    </button>`;
  const button = root.querySelector("button");
  const labelNode = root.querySelector("[data-label]");
  const copyIcon = root.querySelector('[data-icon="copy"] svg');
  const checkIcon = root.querySelector('[data-icon="check"] svg');

  function render() {
    if (copied) button.setAttribute("data-copied", "");
    else button.removeAttribute("data-copied");
    labelNode.textContent = copied ? copiedLabel : label;
    copyIcon.classList.toggle("scale-50", copied);
    copyIcon.classList.toggle("opacity-0", copied);
    copyIcon.classList.toggle("blur-[2px]", copied);
    copyIcon.classList.toggle("scale-100", !copied);
    copyIcon.classList.toggle("opacity-100", !copied);
    copyIcon.classList.toggle("blur-0", !copied);
    checkIcon.classList.toggle("scale-100", copied);
    checkIcon.classList.toggle("opacity-100", copied);
    checkIcon.classList.toggle("blur-0", copied);
    checkIcon.classList.toggle("scale-50", !copied);
    checkIcon.classList.toggle("opacity-0", !copied);
    checkIcon.classList.toggle("blur-[2px]", !copied);
  }

  function setCopied(value) {
    copied = value;
    onCopiedChange?.(value, content);
    render();
  }

  function handleClick() {
    if (!content || copied) return;
    const done = () => {
      setCopied(true);
      clearTimeout(timer);
      timer = setTimeout(() => setCopied(false), delay);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(content).then(done, done);
    else done();
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

  render();
  button.addEventListener("click", handleClick);
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointerleave", release);

  return {
    element: button,
    get copied() { return copied; },
    destroy() {
      clearTimeout(timer);
      button.removeEventListener("click", handleClick);
      button.removeEventListener("pointerdown", press);
      button.removeEventListener("pointerup", release);
      button.removeEventListener("pointerleave", release);
      root.innerHTML = "";
    },
  };
}

import { animate } from "motion";

let uid = 0;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createCollapsible(root, options = {}) {
  const { defaultOpen = false, trigger = "Show details", content = "" } = options;
  const id = `collapsible-${++uid}`;
  let open = defaultOpen;
  root.innerHTML = `
    <div data-slot="collapsible" class="w-full">
      <button type="button" aria-expanded="${open}" aria-controls="${id}"
        class="flex w-full items-center justify-between gap-4 py-3 text-left text-[13.5px] font-medium outline-none">
        <span>${trigger}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" class="size-4 text-muted-foreground transition-transform duration-[450ms]"
          style="transition-timing-function:cubic-bezier(0.4,0,0.1,1);transform:rotate(${open ? 180 : 0}deg)">
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </button>
      <div id="${id}" role="region" class="overflow-hidden"
        style="height:${open ? "auto" : "0px"};opacity:${open ? 1 : 0}">
        <div class="pb-3 text-[13px] leading-6 text-muted-foreground">${content}</div>
      </div>
    </div>`;

  const button = root.querySelector("button");
  const panel = root.querySelector("[role=region]");
  const icon = root.querySelector("svg");

  function render() {
    button.setAttribute("aria-expanded", String(open));
    icon.style.transform = `rotate(${open ? 180 : 0}deg)`;
  }

  button.addEventListener("click", () => {
    open = !open;
    render();
    if (reduce()) {
      panel.style.height = open ? "auto" : "0px";
      panel.style.opacity = open ? "1" : "0";
      return;
    }
    if (open) {
      panel.style.height = "0px";
      panel.style.opacity = "0";
      const height = panel.scrollHeight;
      animate(panel, { height: ["0px", `${height}px`] }, { duration: 0.45, ease: [0.4, 0, 0.1, 1] }).finished.then(() => {
        panel.style.height = "auto";
      });
      animate(panel, { opacity: [0, 1] }, { duration: 0.3, ease: [0.23, 1, 0.32, 1] });
    } else {
      const height = panel.scrollHeight;
      animate(panel, { height: [`${height}px`, "0px"], opacity: [1, 0] }, { duration: 0.3, ease: [0, 0, 0.58, 1] });
    }
  });

  return { get open() { return open; }, destroy() { root.innerHTML = ""; } };
}

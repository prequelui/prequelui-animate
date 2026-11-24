import { animate } from "motion";

const ease = [0.215, 0.61, 0.355, 1];
let uid = 0;

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createAccordion(root, options) {
  const {
    items = [],
    type = "single",
    defaultValue = undefined,
    collapsible = true,
  } = options;
  const initial =
    defaultValue === undefined
      ? []
      : Array.isArray(defaultValue)
        ? [...defaultValue]
        : [defaultValue];
  let open = initial;
  const base = `accordion-${++uid}`;

  root.innerHTML = items
    .map((item) => {
      const isOpen = open.includes(item.value);
      return `
      <div data-slot="accordion-item" data-value="${item.value}"
        data-state="${isOpen ? "open" : "closed"}" class="border-b last:border-b-0">
        <button type="button" aria-expanded="${isOpen}"
          aria-controls="${base}-${item.value}"
          class="flex w-full items-center justify-between gap-4 py-3.5 text-left text-[13.5px] font-medium outline-none transition-colors focus-visible:text-foreground">
          <span>${item.title}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="size-4 text-muted-foreground transition-transform duration-[350ms]"
            style="transition-timing-function:cubic-bezier(0.215,0.61,0.355,1);transform:rotate(${isOpen ? 180 : 0}deg)">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <div id="${base}-${item.value}" role="region" class="overflow-hidden"
          style="height:${isOpen ? "auto" : "0px"};opacity:${isOpen ? 1 : 0};filter:blur(${isOpen ? 0 : 2}px)">
          <div class="pb-4 pr-6 text-[13px] leading-6 text-muted-foreground">${item.content}</div>
        </div>
      </div>`;
    })
    .join("");

  function render() {
    root.querySelectorAll("[data-slot=accordion-item]").forEach((row) => {
      const value = row.getAttribute("data-value");
      const isOpen = open.includes(value);
      row.setAttribute("data-state", isOpen ? "open" : "closed");
      const button = row.querySelector("button");
      const panel = row.querySelector("[role=region]");
      const icon = row.querySelector("svg");
      button.setAttribute("aria-expanded", String(isOpen));
      icon.style.transform = `rotate(${isOpen ? 180 : 0}deg)`;
      panel.setAttribute("aria-hidden", String(!isOpen));
      return { value, isOpen, panel };
    });
  }

  function animatePanel(panel, isOpen) {
    if (!panel) return;
    if (prefersReduced()) {
      panel.style.height = isOpen ? "auto" : "0px";
      panel.style.opacity = isOpen ? "1" : "0";
      panel.style.filter = "blur(0px)";
      return;
    }
    if (isOpen) {
      panel.style.height = "0px";
      panel.style.opacity = "0";
      panel.style.filter = "blur(2px)";
      const height = panel.scrollHeight;
      animate(panel, { height: ["0px", `${height}px`] }, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        bounce: 0,
      }).finished.then(() => {
        panel.style.height = "auto";
      });
      animate(
        panel,
        { opacity: [0, 1], filter: ["blur(2px)", "blur(0px)"] },
        { duration: 0.25, ease },
      );
    } else {
      const height = panel.scrollHeight;
      animate(panel, { height: [`${height}px`, "0px"] }, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        bounce: 0,
      });
      animate(
        panel,
        { opacity: [1, 0], filter: ["blur(0px)", "blur(2px)"] },
        { duration: 0.25, ease },
      );
    }
  }

  function toggle(value) {
    const isOpen = open.includes(value);
    if (type === "single") {
      open = isOpen ? (collapsible ? [] : open) : [value];
    } else {
      open = isOpen ? open.filter((entry) => entry !== value) : [...open, value];
    }
    const row = root.querySelector(`[data-value="${value}"]`);
    const panel = row?.querySelector("[role=region]");
    render();
    animatePanel(panel, open.includes(value));
  }

  root.querySelectorAll("[data-slot=accordion-item]").forEach((row) => {
    const value = row.getAttribute("data-value");
    row.querySelector("button").addEventListener("click", () => toggle(value));
    row.querySelector("[role=region]").setAttribute("aria-hidden", String(!open.includes(value)));
  });

  return {
    toggle,
    destroy() {
      root.innerHTML = "";
    },
  };
}

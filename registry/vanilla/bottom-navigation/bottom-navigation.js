import { animate } from "motion";

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const selectionSpring = { type: "spring", stiffness: 300, damping: 30 };

export function createBottomNavigation(root, options = {}) {
  const {
    items = [],
    defaultValue = "",
    hideOnScroll = false,
    className = "",
    onValueChange,
  } = options;
  const controlled = options.value !== undefined;
  let current = controlled ? options.value : defaultValue;
  let hidden = false;
  let lastY = 0;
  let highlightControl;
  let navControl;

  root.innerHTML = `
    <nav data-slot="bottom-navigation"
      class="relative flex w-full max-w-[340px] items-center justify-between gap-1 rounded-2xl border bg-background p-1.5 shadow-sm ${className}">
      <span data-highlight aria-hidden="true"
        class="pointer-events-none absolute left-0 top-0 rounded-xl bg-accent" style="opacity:0"></span>
      ${items
        .map(
          (item) => `
        <button type="button" data-item="${item.value}"
          class="relative flex h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40">
          <span class="relative flex items-center justify-center [&_svg]:size-4">${item.icon ?? ""}</span>
          <span class="relative text-[13px] font-medium">${item.label}</span>
        </button>`,
        )
        .join("")}
    </nav>`;

  const nav = root.querySelector("[data-slot]");
  const highlight = root.querySelector("[data-highlight]");
  const buttons = Array.from(nav.querySelectorAll("[data-item]"));

  function activeButton() {
    return buttons.find((button) => button.dataset.item === current);
  }

  function paint(initial) {
    buttons.forEach((button) => {
      const active = button.dataset.item === current;
      button.dataset.state = active ? "active" : "inactive";
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
      button.className = `relative flex h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`;
    });

    const button = activeButton();
    if (!button) {
      highlight.style.opacity = "0";
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const rect = button.getBoundingClientRect();
    const box = {
      x: rect.left - navRect.left,
      y: rect.top - navRect.top,
      width: rect.width,
      height: rect.height,
    };
    highlight.style.opacity = "1";
    if (initial || reduce()) {
      highlightControl?.stop?.();
      highlight.style.width = `${box.width}px`;
      highlight.style.height = `${box.height}px`;
      highlight.style.transform = `translate3d(${box.x}px, ${box.y}px, 0)`;
      return;
    }
    highlightControl?.stop?.();
    highlightControl = animate(highlight, box, selectionSpring);
  }

  function select(value) {
    if (value === current) return;
    current = value;
    if (!controlled) options.value = value;
    paint(false);
    onValueChange?.(value);
  }

  function onClick(event) {
    const button = event.target.closest("[data-item]");
    if (!button) return;
    select(button.dataset.item);
  }

  function onScroll() {
    const y = window.scrollY;
    const shouldHide = y > 24 && y > lastY;
    lastY = y;
    if (shouldHide === hidden) return;
    hidden = shouldHide;
    const target = hidden && !reduce() ? 110 : 0;
    navControl?.stop?.();
    navControl = animate(nav, { y: target }, selectionSpring);
  }

  nav.addEventListener("click", onClick);
  if (hideOnScroll) window.addEventListener("scroll", onScroll, { passive: true });

  requestAnimationFrame(() => paint(true));

  return {
    element: nav,
    select,
    get value() {
      return current;
    },
    destroy() {
      highlightControl?.stop?.();
      navControl?.stop?.();
      nav.removeEventListener("click", onClick);
      if (hideOnScroll) window.removeEventListener("scroll", onScroll);
      root.innerHTML = "";
    },
  };
}

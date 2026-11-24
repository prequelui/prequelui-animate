import { animate } from "motion";

const FALLBACK = ["Daily", "Weekly", "Monthly"];
const highlightSpring = { type: "spring", stiffness: 500, damping: 40 };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createHighlight(root, options = {}) {
  const {
    items = FALLBACK,
    defaultValue = null,
    hover = false,
    click = true,
    disabled = false,
    className = "",
    activeClass = "bg-background shadow-sm",
    itemClass = "rounded-lg px-4 py-2 text-[13px] font-medium",
    transition,
  } = options;
  const entries = items.map((item) =>
    typeof item === "string"
      ? { value: item, label: item, disabled: false }
      : {
          value: item.value,
          label: item.label ?? item.value,
          disabled: Boolean(item.disabled),
        },
  );
  let internal = defaultValue;
  let previous = null;
  let control;
  let canHover = false;

  root.innerHTML = `
    <div data-slot="highlight" class="relative ${className}">
      <span data-surface aria-hidden="true" data-slot="highlight-surface"
        class="pointer-events-none absolute left-0 top-0 z-0 rounded-[inherit] ${activeClass}"
        style="opacity:0"></span>
      ${entries
        .map(
          (entry) => `
        <button type="button" data-slot="highlight-item" data-value="${entry.value}"
          data-highlight-value="${entry.value}" data-item-disabled="${entry.disabled ? "true" : "false"}"
          aria-disabled="${entry.disabled ? "true" : "false"}" aria-pressed="false"
          class="relative z-[1] ${itemClass}">${entry.label}</button>`,
        )
        .join("")}
    </div>`;
  const host = root.querySelector("[data-slot]");
  const surface = root.querySelector("[data-surface]");
  const buttons = Array.from(host.querySelectorAll("[data-highlight-value]"));

  function active() {
    return options.value !== undefined ? options.value : internal;
  }

  function paintActive() {
    buttons.forEach((button) => {
      const on = active() === button.dataset.highlightValue;
      button.dataset.active = on ? "true" : "false";
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function isDisabled(next) {
    if (next === null || next === undefined) return false;
    return Boolean(entries.find((entry) => entry.value === next)?.disabled);
  }

  function setValue(next) {
    if (options.disabled ?? disabled) return;
    if (isDisabled(next)) return;
    if (options.value === undefined) internal = next;
    paintActive();
    queueMicrotask(position);
  }

  function select(next) {
    if (options.disabled ?? disabled) return;
    if (isDisabled(next)) return;
    if (options.value === undefined) internal = next;
    options.onValueChange?.(next);
    paintActive();
    queueMicrotask(position);
  }

  function position() {
    const value = active();
    if (!surface || value === null || value === undefined) {
      if (surface) surface.style.opacity = "0";
      previous = null;
      return;
    }
    const node = buttons.find((element) => element.dataset.highlightValue === value);
    if (!node) return;
    const box = host.getBoundingClientRect();
    const rect = node.getBoundingClientRect();
    const next = {
      left: rect.left - box.left,
      top: rect.top - box.top,
      width: rect.width,
      height: rect.height,
    };
    surface.style.opacity = "1";
    if (!previous || reduce()) {
      surface.style.width = `${next.width}px`;
      surface.style.height = `${next.height}px`;
      surface.style.transform = `translate(${next.left}px, ${next.top}px)`;
      previous = next;
      return;
    }
    const from = previous;
    previous = next;
    control?.stop?.();
    control = animate(
      surface,
      {
        width: [from.width, next.width],
        height: [from.height, next.height],
        x: [from.left, next.left],
        y: [from.top, next.top],
      },
      transition ?? highlightSpring,
    );
  }

  const listeners = buttons.map((button) => {
    const value = button.dataset.highlightValue;
    const enter = () => {
      if (options.disabled ?? disabled) return;
      if ((options.hover ?? hover) && canHover) select(value);
    };
    const leave = () => {
      if (options.disabled ?? disabled) return;
      if ((options.hover ?? hover) && canHover && active() === value) select(null);
    };
    const onClick = () => {
      if (options.disabled ?? disabled) return;
      if (!((options.hover ?? hover) && canHover) && (options.click ?? click) !== false) {
        select(value);
      }
    };
    button.addEventListener("pointerenter", enter);
    button.addEventListener("pointerleave", leave);
    button.addEventListener("click", onClick);
    return { button, enter, leave, onClick };
  });

  canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  paintActive();
  queueMicrotask(position);

  return {
    element: host,
    select,
    setValue,
    refresh() {
      paintActive();
      queueMicrotask(position);
    },
    destroy() {
      control?.stop?.();
      listeners.forEach(({ button, enter, leave, onClick }) => {
        button.removeEventListener("pointerenter", enter);
        button.removeEventListener("pointerleave", leave);
        button.removeEventListener("click", onClick);
      });
      root.innerHTML = "";
    },
  };
}

import { animate } from "motion";

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const pinnedSpring = { type: "spring", stiffness: 320, damping: 25, mass: 0.8 };

const PIN_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" class="size-3"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>`;

const PIN_OFF_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" class="size-3"><path d="M12 17v5"/><path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89"/><path d="m2 2 20 20"/><path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11"/></svg>`;

const fallbackItems = [
  { id: "aurora", label: "Aurora", pinned: true },
  { id: "atlas", label: "Atlas", pinned: true },
  { id: "beacon", label: "Beacon", pinned: false },
  { id: "canvas", label: "Canvas", pinned: false },
];

export function createPinnedList(root, options = {}) {
  const {
    defaultItems = fallbackItems,
    pinnedLabel = "Pinned",
    unpinnedLabel = "Everything else",
    className = "",
    onItemsChange,
  } = options;
  const controlled = options.items !== undefined;
  let items = controlled ? options.items : defaultItems.map((item) => ({ ...item }));
  let movingId = null;
  let moveTimer;
  let iconControls = [];

  root.innerHTML = `<div data-slot="pinned-list" class="w-full max-w-[300px] space-y-4 ${className}"></div>`;
  const host = root.querySelector("[data-slot]");

  function itemMarkup(item) {
    return `
      <button type="button" data-pinned-id="${item.id}" data-pinned="${item.pinned}"
        style="z-index:${movingId === item.id ? 10 : 1}"
        class="flex w-full items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2 text-left text-[13px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <span class="flex min-w-0 items-center gap-2">
          <span data-pin-marker class="text-muted-foreground"
            style="opacity:${item.pinned ? 1 : 0};transform:scale(${item.pinned ? 1 : 0.8})">${PIN_ICON}</span>
          <span class="truncate">${item.label}</span>
        </span>
        <span class="flex items-center gap-1 text-[13px] text-muted-foreground">
          ${item.pinned ? PIN_OFF_ICON : PIN_ICON}
          ${item.pinned ? "Unpin" : "Pin"}
        </span>
      </button>`;
  }

  function render() {
    host.innerHTML = [
      { key: true, title: pinnedLabel },
      { key: false, title: unpinnedLabel },
    ]
      .map(
        (group) => `
        <div>
          <p class="mb-1.5 text-[13px] uppercase tracking-[0.14em] text-muted-foreground">${group.title}</p>
          <div class="min-h-9 space-y-1">
            ${items
              .filter((item) => item.pinned === group.key)
              .map(itemMarkup)
              .join("")}
          </div>
        </div>`,
      )
      .join("");
    paintMarkers();
  }

  function paintMarkers() {
    iconControls.forEach((control) => control.stop?.());
    iconControls = [];
    host.querySelectorAll("[data-pinned-id]").forEach((button) => {
      const pinned = button.dataset.pinned === "true";
      const marker = button.querySelector("[data-pin-marker]");
      if (!marker) return;
      iconControls.push(
        animate(
          marker,
          { opacity: pinned ? 1 : 0, scale: pinned ? 1 : 0.8 },
          reduce() ? { duration: 0 } : { duration: 0.22, ease: [0.23, 1, 0.32, 1] },
        ),
      );
    });
  }

  function snapshot() {
    const map = new Map();
    host.querySelectorAll("[data-pinned-id]").forEach((node) => {
      map.set(node.dataset.pinnedId, node.getBoundingClientRect());
    });
    return map;
  }

  function flip(before) {
    if (reduce()) return;
    host.querySelectorAll("[data-pinned-id]").forEach((node) => {
      const previous = before.get(node.dataset.pinnedId);
      if (!previous) return;
      const next = node.getBoundingClientRect();
      const dy = previous.top - next.top;
      if (Math.abs(dy) < 0.5) return;
      animate(node, { y: [dy, 0] }, pinnedSpring);
    });
  }

  function toggle(id) {
    const before = snapshot();
    movingId = id;
    items = items.map((item) =>
      item.id === id ? { ...item, pinned: !item.pinned } : item,
    );
    if (!controlled) options.items = items;
    onItemsChange?.(items);
    render();
    flip(before);
    clearTimeout(moveTimer);
    moveTimer = setTimeout(
      () => {
        movingId = null;
        host.querySelectorAll("[data-pinned-id]").forEach((node) => {
          node.style.zIndex = "1";
        });
      },
      reduce() ? 0 : 360,
    );
  }

  function onClick(event) {
    const button = event.target.closest("[data-pinned-id]");
    if (!button) return;
    toggle(button.dataset.pinnedId);
  }

  host.addEventListener("click", onClick);
  render();

  return {
    element: host,
    toggle,
    get items() {
      return items;
    },
    destroy() {
      clearTimeout(moveTimer);
      iconControls.forEach((control) => control.stop?.());
      host.removeEventListener("click", onClick);
      root.innerHTML = "";
    },
  };
}

let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .card { animation: card-pop 320ms cubic-bezier(0.23,1,0.32,1) both; }
    @keyframes card-pop { from { opacity: 0; transform: translateY(4px) scale(0.95); filter: blur(2px); } }
    @media (prefers-reduced-motion: reduce) {
      .card { animation: card-fade 200ms linear both; }
      @keyframes card-fade { from { opacity: 0; } }
    }`;
  document.head.appendChild(style);
}

export function createHoverCard(root, options = {}) {
  ensureStyles();
  const {
    trigger = "@prequelui",
    title = "PrequelUI Animate",
    description = "Animated primitives for interfaces that already have a design system.",
    content = "",
  } = options;
  const id = `hover-${++uid}`;
  let open = false;
  let enterTimer;
  let leaveTimer;

  root.innerHTML = `
    <span class="relative inline-block" data-hover="${id}">
      <button type="button" class="text-[13px] font-medium underline decoration-border underline-offset-4">${trigger}</button>
    </span>`;
  const host = root.querySelector(`[data-hover="${id}"]`);

  function render() {
    host.querySelector(".card")?.remove();
    if (!open) return;
    const card = document.createElement("div");
    card.className = "card absolute left-0 top-full z-40 mt-2 w-64 rounded-xl border bg-background p-4 shadow-xl";
    card.innerHTML = `<p class="text-[13px] font-medium">${title}</p>
      <p class="mt-1 text-[13px] leading-6 text-muted-foreground">${description}</p>${content}`;
    host.appendChild(card);
  }

  function show() {
    clearTimeout(leaveTimer);
    enterTimer = setTimeout(() => {
      open = true;
      render();
    }, 200);
  }
  function hide() {
    clearTimeout(enterTimer);
    leaveTimer = setTimeout(() => {
      open = false;
      render();
    }, 150);
  }

  host.addEventListener("pointerenter", show);
  host.addEventListener("pointerleave", hide);
  host.addEventListener("focusin", show);
  host.addEventListener("focusout", hide);

  return {
    get open() { return open; },
    destroy() {
      clearTimeout(enterTimer);
      clearTimeout(leaveTimer);
      root.innerHTML = "";
    },
  };
}

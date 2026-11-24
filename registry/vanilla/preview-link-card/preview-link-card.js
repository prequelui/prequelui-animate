let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .preview { animation: preview-in 250ms cubic-bezier(0.23,1,0.32,1) both; }
    @keyframes preview-in { from { opacity: 0; transform: translate(-50%, 8px) scale(0.97); filter: blur(6px); } }
    @media (prefers-reduced-motion: reduce) { .preview { animation: preview-fade 150ms linear both; } @keyframes preview-fade { from { opacity: 0; } } }`;
  document.head.appendChild(style);
}

export function createPreviewLinkCard(root, options = {}) {
  ensureStyles();
  const {
    href = "https://prequelui.dev",
    trigger = "prequelui.dev",
    title = "PrequelUI Animate",
    description = "Motion for the primitives you already use.",
    image = "",
    delay = 200,
    closeDelay = 150,
  } = options;
  const id = `preview-${++uid}`;
  let open = false;
  let enterTimer;
  let leaveTimer;

  root.innerHTML = `
    <span class="relative inline-block" data-preview="${id}">
      <a href="${href}" target="_blank" rel="noreferrer"
        class="inline-flex items-center gap-1 text-[13px] font-medium underline decoration-border underline-offset-4">
        ${trigger}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5"><path d="M7 17 17 7M7 7h10v10"/></svg>
      </a>
    </span>`;
  const host = root.querySelector(`[data-preview="${id}"]`);
  host.querySelector("a").addEventListener("click", (event) => event.preventDefault());

  function render() {
    host.querySelector(".preview")?.remove();
    if (!open) return;
    const card = document.createElement("div");
    card.className = "preview absolute left-1/2 top-8 z-40 w-[260px] -translate-x-1/2 overflow-hidden rounded-xl border bg-popover shadow-xl";
    card.innerHTML = `${
      image
        ? `<img src="${image}" alt="" class="h-[92px] w-full object-cover" />`
        : `<div class="h-[92px] bg-[radial-gradient(circle_at_30%_20%,#f6c7ae,transparent_60%),linear-gradient(135deg,#efe9df,#dbe7e2)] dark:bg-[radial-gradient(circle_at_30%_20%,#3a2b2b,transparent_60%),linear-gradient(135deg,#1a1a1a,#101816)]"></div>`
    }<div class="p-3"><p class="text-[13px] font-medium">${title}</p>
      <p class="mt-1 text-[13px] leading-5 text-muted-foreground">${description}</p></div>`;
    host.appendChild(card);
  }

  function show() {
    clearTimeout(leaveTimer);
    enterTimer = setTimeout(() => {
      open = true;
      render();
    }, delay);
  }
  function hide() {
    clearTimeout(enterTimer);
    leaveTimer = setTimeout(() => {
      open = false;
      render();
    }, closeDelay);
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

let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .copy-icon.swapped { animation: copy-swap 150ms cubic-bezier(0.23,1,0.32,1); }
    @keyframes copy-swap { from { transform: scale(0.5); filter: blur(2px); opacity: 0; } }`;
  document.head.appendChild(style);
}

export function createCodeBlock(root, options = {}) {
  ensureStyles();
  const { code = "", filename = "example.ts", typing = true } = options;
  const id = `code-${++uid}`;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let shown = typing && !reduce() ? 0 : code.length;
  let copied = false;
  let typingTimer;
  let copyTimer;

  root.innerHTML = `
    <div class="overflow-hidden rounded-xl border bg-code">
      <div class="flex items-center justify-between border-b px-4 py-2">
        <span class="font-mono text-[13px] text-muted-foreground">${filename}</span>
        <button type="button" aria-label="Copy code" data-copy
          class="relative flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
          <span class="copy-icon"></span>
        </button>
      </div>
      <pre class="overflow-auto p-4 font-mono text-[13px] leading-6"><code data-code></code></pre>
    </div>`;
  const output = root.querySelector("[data-code]");
  const button = root.querySelector("[data-copy]");
  const icon = root.querySelector(".copy-icon");

  function render() {
    output.textContent = code.slice(0, shown) + (shown < code.length ? "▍" : "");
    icon.innerHTML = copied
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5"><path d="M20 6 9 17l-5-5"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
  }

  function start() {
    clearInterval(typingTimer);
    if (!typing || reduce()) {
      shown = code.length;
      render();
      return;
    }
    shown = 0;
    render();
    typingTimer = setInterval(() => {
      if (shown >= code.length) {
        clearInterval(typingTimer);
        return;
      }
      shown += 1;
      render();
    }, 14);
  }

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const area = document.createElement("textarea");
      area.value = code;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    copied = true;
    icon.classList.add("swapped");
    render();
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copied = false;
      icon.classList.remove("swapped");
      render();
    }, 2000);
  });

  start();
  return {
    get copied() { return copied; },
    destroy() {
      clearInterval(typingTimer);
      clearTimeout(copyTimer);
      root.innerHTML = "";
    },
  };
}

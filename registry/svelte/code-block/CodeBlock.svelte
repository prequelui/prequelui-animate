<script>
  import { Check, Copy } from "lucide-svelte";

  let { code, filename = "example.ts", typing = true } = $props();

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let length = $state(typing && !reduce() ? 0 : code.length);
  let copied = $state(false);
  let typingTimer;
  let copyTimer;

  function start() {
    clearInterval(typingTimer);
    if (!typing || reduce()) {
      length = code.length;
      return;
    }
    length = 0;
    typingTimer = setInterval(() => {
      if (length >= code.length) {
        clearInterval(typingTimer);
        return;
      }
      length += 1;
    }, 14);
  }

  $effect(() => {
    code;
    start();
    return () => {
      clearInterval(typingTimer);
      clearTimeout(copyTimer);
    };
  });

  async function copy() {
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
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copied = false), 2000);
  }
</script>

<div class="overflow-hidden rounded-xl border bg-code">
  <div class="flex items-center justify-between border-b px-4 py-2">
    <span class="font-mono text-[13px] text-muted-foreground">{filename}</span>
    <button type="button" aria-label={copied ? "Copied" : "Copy code"} class="relative flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground" onclick={copy}>
      <span class="copy-icon" class:swapped={copied}>
        {#if copied}<Check class="size-3.5" />{:else}<Copy class="size-3.5" />{/if}
      </span>
    </button>
  </div>
  <pre class="overflow-auto p-4 font-mono text-[13px] leading-6"><code>{code.slice(0, length)}{length < code.length ? "▍" : ""}</code></pre>
</div>

<style>
  .copy-icon { display: flex; transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1), opacity 150ms; }
  .copy-icon.swapped { animation: copy-swap 150ms cubic-bezier(0.23, 1, 0.32, 1); }
  @keyframes copy-swap { from { transform: scale(0.5); filter: blur(2px); opacity: 0; } }
</style>

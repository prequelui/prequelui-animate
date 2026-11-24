import { Show, createEffect, createSignal, onCleanup } from "solid-js";
import { Check, Copy } from "lucide-solid";

export type CodeBlockProps = {
  code: string;
  filename?: string;
  typing?: boolean;
};

export function CodeBlock(props: CodeBlockProps) {
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [length, setLength] = createSignal(
    props.typing === false || reduce() ? props.code.length : 0,
  );
  const [copied, setCopied] = createSignal(false);
  let typingTimer: number | undefined;
  let copyTimer: number | undefined;

  createEffect(() => {
    const code = props.code;
    clearInterval(typingTimer);
    if (props.typing === false || reduce()) {
      setLength(code.length);
      return;
    }
    setLength(0);
    typingTimer = window.setInterval(() => {
      setLength((value) => {
        if (value >= code.length) {
          clearInterval(typingTimer);
          return value;
        }
        return value + 1;
      });
    }, 14);
  });

  onCleanup(() => {
    clearInterval(typingTimer);
    clearTimeout(copyTimer);
  });

  async function copy() {
    try {
      await navigator.clipboard.writeText(props.code);
    } catch {
      const area = document.createElement("textarea");
      area.value = props.code;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    clearTimeout(copyTimer);
    copyTimer = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div class="overflow-hidden rounded-xl border bg-code">
      <div class="flex items-center justify-between border-b px-4 py-2">
        <span class="font-mono text-[13px] text-muted-foreground">{props.filename ?? "example.ts"}</span>
        <button type="button" aria-label={copied() ? "Copied" : "Copy code"} onClick={copy} class="relative flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
          <span class="copy-icon">
            <Show when={copied()} fallback={<Copy class="size-3.5" />}>
              <Check class="size-3.5" />
            </Show>
          </span>
        </button>
      </div>
      <pre class="overflow-auto p-4 font-mono text-[13px] leading-6">
        <code>
          {props.code.slice(0, length())}
          {length() < props.code.length ? "▍" : ""}
        </code>
      </pre>
      <style>{`
        .copy-icon { display: flex; animation: copy-swap 150ms cubic-bezier(0.23,1,0.32,1); }
        @keyframes copy-swap { from { transform: scale(0.5); filter: blur(2px); opacity: 0; } }
      `}</style>
    </div>
  );
}

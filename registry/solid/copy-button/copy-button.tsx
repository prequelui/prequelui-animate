import { Check, Copy } from "lucide-solid";
import { animate } from "motion";
import { Show, createMemo, createSignal, onCleanup } from "solid-js";
import type { JSX } from "solid-js";

export type CopyButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  content: string;
  copied?: boolean;
  defaultCopied?: boolean;
  onCopiedChange?: (copied: boolean, content?: string) => void;
  delay?: number;
};

export function CopyButton(props: CopyButtonProps) {
  let button: HTMLButtonElement | undefined;
  const [inner, setInner] = createSignal(props.defaultCopied ?? false);
  const isCopied = createMemo(() =>
    props.copied === undefined ? inner() : props.copied,
  );
  let timer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => clearTimeout(timer));

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const press = () => {
    if (!button || reduce()) return;
    animate(
      button,
      { scale: 0.97 },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  };

  const release = () => {
    if (!button || reduce()) return;
    animate(
      button,
      { scale: 1 },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  };

  const setCopied = (value: boolean) => {
    if (props.copied === undefined) setInner(value);
    props.onCopiedChange?.(value, props.content);
  };

  const handleClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (event) => {
    if (typeof props.onClick === "function") props.onClick(event);
    if (event.defaultPrevented || !props.content || isCopied()) return;
    const done = () => {
      setCopied(true);
      clearTimeout(timer);
      timer = setTimeout(() => setCopied(false), props.delay ?? 3000);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(props.content).then(done, done);
    else done();
  };

  return (
    <button
      {...props}
      ref={button}
      type="button"
      data-slot="copy-button"
      data-copied={isCopied() ? "" : undefined}
      onClick={handleClick}
      onPointerDown={(event) => {
        if (typeof props.onPointerDown === "function") props.onPointerDown(event);
        press();
      }}
      onPointerUp={(event) => {
        if (typeof props.onPointerUp === "function") props.onPointerUp(event);
        release();
      }}
      onPointerLeave={(event) => {
        if (typeof props.onPointerLeave === "function") props.onPointerLeave(event);
        release();
      }}
      class={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border bg-background px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${props.class ?? ""}`}
    >
      <span data-slot="copy-button-icon" class="relative inline-flex size-4 items-center justify-center">
        <Copy
          aria-hidden="true"
          class={`absolute inset-0 size-4 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${isCopied() ? "scale-50 opacity-0 blur-[2px]" : "scale-100 opacity-100 blur-0"}`}
        />
        <Check
          aria-hidden="true"
          class={`absolute inset-0 size-4 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${isCopied() ? "scale-100 opacity-100 blur-0" : "scale-50 opacity-0 blur-[2px]"}`}
        />
      </span>
      <Show when={props.children} fallback={isCopied() ? "Copied" : "Copy"}>
        {props.children}
      </Show>
    </button>
  );
}

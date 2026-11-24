import { Show, createSignal, onCleanup } from "solid-js";

export type TooltipProps = {
  trigger?: string;
  content?: string;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
  closeDelay?: number;
  class?: string;
};

const store = ((globalThis as Record<string, unknown>).__prequelTip ??= {
  open: new Set<symbol>(),
  cooledAt: 0,
}) as { open: Set<symbol>; cooledAt: number };

const sides = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export function Tooltip(props: TooltipProps) {
  const [open, setOpen] = createSignal(false);
  const [instant, setInstant] = createSignal(false);
  const id = Symbol("tooltip");
  let openTimer: number | undefined;
  let closeTimer: number | undefined;

  const show = () => {
    clearTimeout(closeTimer);
    clearTimeout(openTimer);
    const warm = store.open.size > 0 || Date.now() - store.cooledAt < 300;
    setInstant(warm);
    openTimer = window.setTimeout(
      () => {
        store.open.add(id);
        setOpen(true);
      },
      warm ? 0 : (props.delay ?? 180),
    );
  };
  const hide = () => {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      store.open.delete(id);
      if (store.open.size === 0) store.cooledAt = Date.now();
      setOpen(false);
      setInstant(false);
    }, props.closeDelay ?? 80);
  };
  onCleanup(() => {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    store.open.delete(id);
  });

  return (
    <span
      class="relative inline-flex"
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocusIn={show}
      onFocusOut={hide}
    >
      <button type="button" class="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium">
        {props.trigger ?? "Hover me"}
      </button>
      <Show when={open()}>
        <span
          role="tooltip"
          class={`tip pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[13px] font-medium text-primary-foreground shadow-md ${sides[props.side ?? "top"]} ${props.class ?? ""}`}
          classList={{ instant: instant() }}
        >
          {props.content ?? "Saved just now"}
        </span>
      </Show>
      <style>{`
        .tip { animation: tip-in 320ms cubic-bezier(0.23,1,0.32,1) both; }
        .tip.instant { animation-duration: 1ms; }
        @keyframes tip-in { from { opacity: 0; transform: scale(0.7); filter: blur(6px); } }
        @media (prefers-reduced-motion: reduce) { .tip { animation: tip-fade 200ms linear both; } @keyframes tip-fade { from { opacity: 0; } } }
      `}</style>
    </span>
  );
}

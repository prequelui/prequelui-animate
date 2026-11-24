import { Show, createSignal, onCleanup } from "solid-js";

export type HoverCardProps = {
  trigger?: string;
  title?: string;
  description?: string;
  children?: unknown;
};

export function HoverCard(props: HoverCardProps) {
  const [open, setOpen] = createSignal(false);
  let enterTimer: number | undefined;
  let leaveTimer: number | undefined;

  const show = () => {
    clearTimeout(leaveTimer);
    enterTimer = window.setTimeout(() => setOpen(true), 200);
  };
  const hide = () => {
    clearTimeout(enterTimer);
    leaveTimer = window.setTimeout(() => setOpen(false), 150);
  };
  onCleanup(() => {
    clearTimeout(enterTimer);
    clearTimeout(leaveTimer);
  });

  return (
    <span
      class="relative inline-block"
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocusIn={show}
      onFocusOut={hide}
    >
      <button type="button" class="text-[13px] font-medium underline decoration-border underline-offset-4">
        {props.trigger ?? "@prequelui"}
      </button>
      <Show when={open()}>
        <div class="card absolute left-0 top-full z-40 mt-2 w-64 rounded-xl border bg-background p-4 shadow-xl">
          <p class="text-[13px] font-medium">{props.title ?? "PrequelUI Animate"}</p>
          <p class="mt-1 text-[13px] leading-6 text-muted-foreground">
            {props.description ?? "Animated primitives for interfaces that already have a design system."}
          </p>
          {props.children as never}
        </div>
      </Show>
      <style>{`
        .card { animation: card-pop 320ms cubic-bezier(0.23,1,0.32,1) both; }
        @keyframes card-pop { from { opacity: 0; transform: translateY(4px) scale(0.95); filter: blur(2px); } }
        @media (prefers-reduced-motion: reduce) {
          .card { animation: card-fade 200ms linear both; }
          @keyframes card-fade { from { opacity: 0; } }
        }
      `}</style>
    </span>
  );
}

import { Show, createSignal, onCleanup } from "solid-js";
import { ArrowUpRight } from "lucide-solid";

export type PreviewLinkCardProps = {
  href?: string;
  trigger?: string;
  title?: string;
  description?: string;
  image?: string;
  delay?: number;
  closeDelay?: number;
};

export function PreviewLinkCard(props: PreviewLinkCardProps) {
  const [open, setOpen] = createSignal(false);
  let enterTimer: number | undefined;
  let leaveTimer: number | undefined;

  const show = () => {
    clearTimeout(leaveTimer);
    enterTimer = window.setTimeout(() => setOpen(true), props.delay ?? 200);
  };
  const hide = () => {
    clearTimeout(enterTimer);
    leaveTimer = window.setTimeout(() => setOpen(false), props.closeDelay ?? 150);
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
      <a
        href={props.href ?? "https://prequelui.dev"}
        target="_blank"
        rel="noreferrer"
        onClick={(event) => event.preventDefault()}
        class="inline-flex items-center gap-1 text-[13px] font-medium underline decoration-border underline-offset-4"
      >
        {props.trigger ?? "prequelui.dev"}
        <ArrowUpRight class="size-3.5" />
      </a>
      <Show when={open()}>
        <div class="preview absolute left-1/2 top-8 z-40 w-[260px] -translate-x-1/2 overflow-hidden rounded-xl border bg-popover shadow-xl">
          <Show
            when={props.image}
            fallback={
              <div class="h-[92px] bg-[radial-gradient(circle_at_30%_20%,#f6c7ae,transparent_60%),linear-gradient(135deg,#efe9df,#dbe7e2)] dark:bg-[radial-gradient(circle_at_30%_20%,#3a2b2b,transparent_60%),linear-gradient(135deg,#1a1a1a,#101816)]" />
            }
          >
            <img src={props.image} alt="" class="h-[92px] w-full object-cover" />
          </Show>
          <div class="p-3">
            <p class="text-[13px] font-medium">{props.title ?? "PrequelUI Animate"}</p>
            <p class="mt-1 text-[13px] leading-5 text-muted-foreground">
              {props.description ?? "Motion for the primitives you already use."}
            </p>
          </div>
        </div>
      </Show>
      <style>{`
        .preview { animation: preview-in 250ms cubic-bezier(0.23,1,0.32,1) both; }
        @keyframes preview-in { from { opacity: 0; transform: translate(-50%, 8px) scale(0.97); filter: blur(6px); } }
        @media (prefers-reduced-motion: reduce) { .preview { animation: preview-fade 150ms linear both; } @keyframes preview-fade { from { opacity: 0; } } }
      `}</style>
    </span>
  );
}

import { Show, createEffect, createSignal, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import { X } from "lucide-solid";

export type SheetProps = {
  trigger?: string;
  title?: string;
  description?: string;
  side?: "left" | "right";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: unknown;
};

export function Sheet(props: SheetProps) {
  const [internal, setInternal] = createSignal(props.defaultOpen ?? false);
  const value = () => props.open ?? internal();

  const setOpen = (next: boolean) => {
    if (props.open === undefined) setInternal(next);
    props.onOpenChange?.(next);
  };

  createEffect(() => {
    if (!value()) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    onCleanup(() => document.removeEventListener("keydown", onKey));
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        class="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium"
      >
        {props.trigger ?? "Open sheet"}
      </button>
      <Show when={value()}>
        <Portal>
          <div class="fixed inset-0 z-50">
            <button
              type="button"
              aria-label="Close sheet"
              onClick={() => setOpen(false)}
              class="sheet-veil absolute inset-0 bg-black/20 backdrop-blur-[3px]"
            />
            <div
              role="dialog"
              aria-modal="true"
              data-side={props.side ?? "right"}
              class={`sheet-panel absolute top-0 flex h-full w-[85%] max-w-sm flex-col border bg-popover p-5 shadow-2xl ${
                (props.side ?? "right") === "right" ? "right-0 border-l" : "left-0 border-r"
              }`}
            >
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                class="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent"
              >
                <X class="size-4" />
              </button>
              <h2 class="pr-8 text-[15px] font-medium">{props.title ?? "Workspace"}</h2>
              <p class="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                {props.description ?? "Choose where this project lives."}
              </p>
              {props.children as never}
            </div>
          </div>
        </Portal>
      </Show>
      <style>{`
        .sheet-veil { animation: veil-in 400ms cubic-bezier(0.215,0.61,0.355,1) both; }
        .sheet-panel { animation: sheet-in-right 400ms cubic-bezier(0.215,0.61,0.355,1) both; }
        .sheet-panel[data-side="left"] { animation-name: sheet-in-left; }
        @keyframes veil-in { from { opacity: 0; } }
        @keyframes sheet-in-right { from { transform: translateX(100%); } }
        @keyframes sheet-in-left { from { transform: translateX(-100%); } }
        @media (prefers-reduced-motion: reduce) { .sheet-veil, .sheet-panel { animation: sheet-fade 200ms linear both; } @keyframes sheet-fade { from { opacity: 0; } } }
      `}</style>
    </>
  );
}

import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { Portal } from "solid-js/web";
import { X } from "lucide-solid";

export type DialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: string;
  title?: string;
  description?: string;
  children?: unknown;
};

export function Dialog(props: DialogProps) {
  const [internal, setInternal] = createSignal(props.defaultOpen ?? false);
  const value = () => props.open ?? internal();

  function setOpen(next: boolean) {
    if (props.open === undefined) setInternal(next);
    props.onOpenChange?.(next);
  }

  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") setOpen(false);
  };
  onMount(() => {
    document.addEventListener("keydown", onKey);
    onCleanup(() => document.removeEventListener("keydown", onKey));
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        class="inline-flex h-8 items-center rounded-md bg-foreground px-3 text-[13px] font-medium text-background"
      >
        {props.trigger ?? "Open dialog"}
      </button>
      <Show when={value()}>
        <Portal>
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
              type="button"
              aria-label="Close dialog"
              onClick={() => setOpen(false)}
              class="absolute inset-0 bg-background/60 backdrop-blur-sm dialog-veil"
            />
            <div
              role="dialog"
              aria-modal="true"
              class="dialog-popup relative w-full max-w-sm rounded-xl border bg-background p-5 shadow-2xl"
            >
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                class="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent"
              >
                <X class="size-4" />
              </button>
              <h2 class="text-[15px] font-medium">{props.title ?? "Edit profile"}</h2>
              <p class="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                {props.description ?? "Make changes to your profile here."}
              </p>
              {props.children as never}
              <div class="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} class="h-8 rounded-md border px-3 text-[13px]">Cancel</button>
                <button type="button" onClick={() => setOpen(false)} class="h-8 rounded-md bg-foreground px-3 text-[13px] font-medium text-background">Save</button>
              </div>
            </div>
          </div>
        </Portal>
      </Show>
      <style>{`
        .dialog-veil { animation: dialog-in 400ms cubic-bezier(0.215,0.61,0.355,1) both; }
        .dialog-popup { animation: dialog-pop 450ms cubic-bezier(0.23,1,0.32,1) both; }
        @keyframes dialog-in { from { opacity: 0; } }
        @keyframes dialog-pop { from { opacity: 0; transform: translateY(8px) scale(0.96); filter: blur(4px); } }
        @media (prefers-reduced-motion: reduce) {
          .dialog-veil, .dialog-popup { animation-duration: 200ms; }
          .dialog-popup { animation: dialog-in 200ms linear both; }
        }
      `}</style>
    </>
  );
}

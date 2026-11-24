import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { Portal } from "solid-js/web";

export type AlertDialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void;
  trigger?: string;
  title?: string;
  description?: string;
  confirmLabel?: string;
};

export function AlertDialog(props: AlertDialogProps) {
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
        class="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium"
      >
        {props.trigger ?? "Delete project"}
      </button>
      <Show when={value()}>
        <Portal>
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button type="button" aria-label="Close dialog" onClick={() => setOpen(false)} class="alert-veil absolute inset-0 bg-background/60 backdrop-blur-sm" />
            <div role="alertdialog" aria-modal="true" class="alert-popup relative w-full max-w-sm rounded-xl border bg-background p-5 shadow-2xl">
              <h2 class="text-[15px] font-medium">{props.title ?? "Delete project?"}</h2>
              <p class="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                {props.description ?? "This action cannot be undone. The project and its data will be removed."}
              </p>
              <div class="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} class="h-8 rounded-md border px-3 text-[13px]">Cancel</button>
                <button
                  type="button"
                  onClick={() => {
                    props.onConfirm?.();
                    setOpen(false);
                  }}
                  class="h-8 rounded-md bg-destructive px-3 text-[13px] font-medium text-destructive-foreground"
                >
                  {props.confirmLabel ?? "Delete"}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      </Show>
      <style>{`
        .alert-veil { animation: alert-in 400ms cubic-bezier(0.215,0.61,0.355,1) both; }
        .alert-popup { animation: alert-pop 450ms cubic-bezier(0.23,1,0.32,1) both; }
        @keyframes alert-in { from { opacity: 0; } }
        @keyframes alert-pop { from { opacity: 0; transform: translateY(8px) scale(0.96); filter: blur(4px); } }
        @media (prefers-reduced-motion: reduce) {
          .alert-veil, .alert-popup { animation-duration: 200ms; }
          .alert-popup { animation: alert-in 200ms linear both; }
        }
      `}</style>
    </>
  );
}

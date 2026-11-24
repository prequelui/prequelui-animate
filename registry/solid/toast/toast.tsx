import { For, createSignal, onCleanup } from "solid-js";
import { Check, X } from "lucide-solid";

export type ToastProps = {
  trigger?: string;
  title?: string;
  description?: string;
  duration?: number;
  class?: string;
};

type ToastEntry = { id: number; title: string; description?: string };

export function Toast(props: ToastProps) {
  const [toasts, setToasts] = createSignal<ToastEntry[]>([]);
  const timers = new Map<number, number>();

  const dismiss = (id: number) => {
    const timer = timers.get(id);
    if (timer) clearTimeout(timer);
    timers.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };
  const add = () => {
    const id = Date.now();
    setToasts((current) =>
      [...current, { id, title: props.title ?? "Changes saved", description: props.description }].slice(-4),
    );
    timers.set(id, window.setTimeout(() => dismiss(id), props.duration ?? 5000));
  };

  onCleanup(() => {
    for (const timer of timers.values()) clearTimeout(timer);
    timers.clear();
  });

  return (
    <div class={`flex w-full max-w-[420px] flex-col items-center gap-4 ${props.class ?? ""}`}>
      <button
        type="button"
        onClick={add}
        class="inline-flex h-9 items-center rounded-lg bg-foreground px-3.5 text-[13px] font-medium text-background"
      >
        {props.trigger ?? "Show toast"}
      </button>
      <div class="relative h-[96px] w-full">
        <For each={toasts()}>
          {(toast, index) => (
            <div
              class="toast absolute bottom-4 left-1/2 flex w-[280px] -translate-x-1/2 items-center gap-2 rounded-xl border bg-popover px-3 py-2.5 text-[13px] shadow-lg"
              style={{ "animation-delay": `${index() * 30}ms` }}
            >
              <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1f9d63] text-white">
                <Check class="size-3" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="block truncate">{toast.title}</span>
                {toast.description && (
                  <span class="mt-0.5 block truncate text-[12px] text-muted-foreground">
                    {toast.description}
                  </span>
                )}
              </span>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => dismiss(toast.id)}
                class="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X class="size-3.5" />
              </button>
            </div>
          )}
        </For>
      </div>
      <style>{`
        .toast { animation: toast-in 320ms cubic-bezier(0.34,1.36,0.64,1) both; }
        @keyframes toast-in { from { opacity: 0; transform: translate(-50%, 24px) scale(0.96); filter: blur(4px); } }
        @media (prefers-reduced-motion: reduce) { .toast { animation: toast-fade 200ms linear both; } @keyframes toast-fade { from { opacity: 0; } } }
      `}</style>
    </div>
  );
}

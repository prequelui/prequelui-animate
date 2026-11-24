import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { Portal } from "solid-js/web";
import { X } from "lucide-solid";

export type DrawerProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: string;
  title?: string;
  description?: string;
  children?: unknown;
};

export function Drawer(props: DrawerProps) {
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
      <button type="button" onClick={() => setOpen(true)} class="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium">
        {props.trigger ?? "Open drawer"}
      </button>
      <Show when={value()}>
        <Portal>
          <div class="fixed inset-0 z-50">
            <button type="button" aria-label="Close drawer" onClick={() => setOpen(false)} class="drawer-veil absolute inset-0 bg-background/60 backdrop-blur-sm" />
            <div role="dialog" aria-modal="true" class="drawer-panel absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col border-l bg-background p-5 shadow-2xl">
              <button type="button" aria-label="Close" onClick={() => setOpen(false)} class="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent">
                <X class="size-4" />
              </button>
              <p class="text-[15px] font-medium">{props.title ?? "Notifications"}</p>
              <p class="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                {props.description ?? "Updates from the projects you follow."}
              </p>
              {props.children as never}
            </div>
          </div>
        </Portal>
      </Show>
      <style>{`
        .drawer-veil { animation: drawer-fade 400ms cubic-bezier(0.215,0.61,0.355,1) both; }
        .drawer-panel { animation: drawer-in 400ms cubic-bezier(0.34,1.2,0.64,1) both; }
        @keyframes drawer-fade { from { opacity: 0; } }
        @keyframes drawer-in { from { transform: translateX(100%); } }
        @media (prefers-reduced-motion: reduce) {
          .drawer-veil, .drawer-panel { animation: drawer-fade 200ms both; }
        }
      `}</style>
    </>
  );
}

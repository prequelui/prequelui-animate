import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import { Portal } from "solid-js/web";

export type ContextMenuItem = {
  label: string;
  shortcut?: string;
  onSelect?: () => void;
  separator?: boolean;
};

export type ContextMenuProps = {
  items: ContextMenuItem[];
  children?: unknown;
};

export function ContextMenu(props: ContextMenuProps) {
  const [position, setPosition] = createSignal<{ x: number; y: number } | null>(null);

  const close = () => setPosition(null);
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") close();
  };
  onMount(() => {
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", onKey);
  });
  onCleanup(() => {
    if (typeof window === "undefined") return;
    document.removeEventListener("pointerdown", close);
    document.removeEventListener("keydown", onKey);
  });

  return (
    <>
      <div
        onContextMenu={(event) => {
          event.preventDefault();
          setPosition({ x: event.clientX, y: event.clientY });
        }}
        class="flex h-24 w-64 items-center justify-center rounded-xl border border-dashed text-[13px] text-muted-foreground"
      >
        {(props.children as never) ?? "Right click here"}
      </div>
      <Show when={position()}>
        <Portal>
          <div
            role="menu"
            class="ctx-panel fixed z-50 min-w-[190px] origin-top-left rounded-xl border bg-background p-1 shadow-xl"
            style={{ left: `${position()!.x}px`, top: `${position()!.y}px` }}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <For each={props.items}>
              {(item, index) => (
                <Show
                  when={!item.separator}
                  fallback={<div role="separator" class="my-1 h-px bg-border" />}
                >
                  <button
                    type="button"
                    role="menuitem"
                    class="ctx-row flex w-full items-center justify-between gap-6 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-accent"
                    style={{ "animation-delay": `${index() * 30}ms` }}
                    onClick={() => {
                      item.onSelect?.();
                      close();
                    }}
                  >
                    <span>{item.label}</span>
                    <Show when={item.shortcut}>
                      <span class="font-mono text-[13px] text-muted-foreground">{item.shortcut}</span>
                    </Show>
                  </button>
                </Show>
              )}
            </For>
          </div>
        </Portal>
      </Show>
      <style>{`
        .ctx-panel { animation: ctx-in 220ms cubic-bezier(0.215,0.61,0.355,1) both; }
        .ctx-row { animation: ctx-row 200ms cubic-bezier(0.215,0.61,0.355,1) both; }
        @keyframes ctx-in { from { opacity: 0; transform: scale(0.96); } }
        @keyframes ctx-row { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
        @media (prefers-reduced-motion: reduce) { .ctx-panel, .ctx-row { animation: none; } }
      `}</style>
    </>
  );
}

import { For, Show, createSignal, onCleanup } from "solid-js";
import { animate } from "motion";
import { Pin, PinOff } from "lucide-solid";

export type PinnedItem = {
  id: string;
  label: string;
  pinned: boolean;
};

export type PinnedListProps = {
  items?: PinnedItem[];
  defaultItems?: PinnedItem[];
  onItemsChange?: (items: PinnedItem[]) => void;
  pinnedLabel?: string;
  unpinnedLabel?: string;
  class?: string;
};

const fallbackItems: PinnedItem[] = [
  { id: "aurora", label: "Aurora", pinned: true },
  { id: "atlas", label: "Atlas", pinned: true },
  { id: "beacon", label: "Beacon", pinned: false },
  { id: "canvas", label: "Canvas", pinned: false },
];

const pinnedSpring = {
  type: "spring" as const,
  stiffness: 320,
  damping: 25,
  mass: 0.8,
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function PinnedList(props: PinnedListProps) {
  let root: HTMLDivElement | undefined;
  let active: Array<ReturnType<typeof animate>> = [];
  const [movingId, setMovingId] = createSignal<string | null>(null);
  const [internal, setInternal] = createSignal<PinnedItem[]>(
    (props.items ?? props.defaultItems ?? fallbackItems).map((item) => ({
      ...item,
    })),
  );

  const list = () => props.items ?? internal();
  const groups = () => [
    { key: true, title: props.pinnedLabel ?? "Pinned" },
    { key: false, title: props.unpinnedLabel ?? "Everything else" },
  ];
  const filtered = (pinned: boolean) =>
    list().filter((item) => item.pinned === pinned);

  const readRects = () => {
    const elements: Record<string, HTMLElement> = {};
    const rects: Record<string, DOMRect> = {};
    if (!root) return { elements, rects };
    root.querySelectorAll<HTMLElement>("[data-pinned-id]").forEach((element) => {
      const id = element.getAttribute("data-pinned-id");
      if (!id) return;
      elements[id] = element;
      rects[id] = element.getBoundingClientRect();
    });
    return { elements, rects };
  };

  const toggle = (id: string) => {
    const before = readRects();
    const next = list().map((item) =>
      item.id === id ? { ...item, pinned: !item.pinned } : item,
    );
    if (props.items === undefined) setInternal(next);
    props.onItemsChange?.(next);

    if (reduce()) return;

    setMovingId(id);
    queueMicrotask(() => {
      const after = readRects();
      active.forEach((control) => control.stop?.());
      active = [];
      for (const [key, element] of Object.entries(after.elements)) {
        const old = before.rects[key];
        if (!old) continue;
        const now = after.rects[key];
        const dx = old.left - now.left;
        const dy = old.top - now.top;
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
        active.push(animate(element, { x: [dx, 0], y: [dy, 0] }, pinnedSpring));
      }
      Promise.all(active.map((control) => control.finished)).then(() => {
        if (movingId() === id) setMovingId(null);
      });
    });
  };

  onCleanup(() => {
    active.forEach((control) => control.stop?.());
  });

  return (
    <div
      ref={(node: HTMLDivElement) => (root = node)}
      data-slot="pinned-list"
      class={`w-full max-w-[300px] space-y-4 ${props.class ?? ""}`}
    >
      <For each={groups()}>
        {(group) => (
          <div>
            <p class="mb-1.5 text-[13px] uppercase tracking-[0.14em] text-muted-foreground">
              {group.title}
            </p>
            <div class="min-h-9 space-y-1">
              <For each={filtered(group.key)}>
                {(item) => (
                  <button
                    type="button"
                    data-pinned-id={item.id}
                    style={{ "z-index": movingId() === item.id ? 10 : 1 }}
                    onClick={() => toggle(item.id)}
                    class="relative flex w-full items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2 text-left text-[13px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                  >
                    <span class="flex min-w-0 items-center gap-2">
                      <span
                        aria-hidden="true"
                        class="text-muted-foreground transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
                        style={{
                          opacity: item.pinned ? 1 : 0,
                          transform: item.pinned ? "scale(1)" : "scale(0.8)",
                        }}
                      >
                        <Pin class="size-3" />
                      </span>
                      <span class="truncate">{item.label}</span>
                    </span>
                    <span class="flex items-center gap-1 text-[13px] text-muted-foreground">
                      <Show when={item.pinned} fallback={<Pin class="size-3" />}>
                        <PinOff class="size-3" />
                      </Show>
                      {item.pinned ? "Unpin" : "Pin"}
                    </span>
                  </button>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}

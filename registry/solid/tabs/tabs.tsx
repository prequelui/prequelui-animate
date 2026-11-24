import { For, Show, createEffect, createMemo, createSignal } from "solid-js";

export type TabItem = {
  value: string;
  label: string;
  content: string;
};

export type TabsProps = {
  items?: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  class?: string;
};

const FALLBACK: TabItem[] = [
  { value: "overview", label: "Overview", content: "A calm summary of the workspace, its members and the latest activity." },
  { value: "activity", label: "Activity", content: "Every change, in order. Hover a row to see who made it and when." },
  { value: "settings", label: "Settings", content: "Name, visibility and notification preferences for this project." },
];

export function Tabs(props: TabsProps) {
  const items = () => props.items ?? FALLBACK;
  const [internal, setInternal] = createSignal(props.defaultValue ?? items()[0]?.value ?? "");
  const current = () => props.value ?? internal();
  const active = createMemo(() => items().find((item) => item.value === current()) ?? items()[0]);
  let buttons: HTMLButtonElement[] = [];
  const [indicator, setIndicator] = createSignal({ left: 0, width: 0 });

  const measure = () => {
    const index = items().findIndex((item) => item.value === current());
    const node = buttons[index];
    if (!node) return;
    setIndicator({ left: node.offsetLeft, width: node.offsetWidth });
  };

  createEffect(() => {
    current();
    items();
    requestAnimationFrame(measure);
  });

  const select = (next: string) => {
    if (props.value === undefined) setInternal(next);
    props.onValueChange?.(next);
  };
  const onKey = (event: KeyboardEvent, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + direction + items().length) % items().length;
    const item = items()[next];
    if (!item) return;
    select(item.value);
    requestAnimationFrame(() => buttons[next]?.focus());
  };

  return (
    <div class={`w-full max-w-[460px] ${props.class ?? ""}`}>
      <div role="tablist" aria-label="Tabs" class="relative flex items-center gap-1 rounded-lg bg-accent p-1">
        <span
          aria-hidden="true"
          class="absolute inset-y-1 rounded-md bg-background shadow-sm transition-[left,width] duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:transition-none"
          style={{ left: `${indicator().left}px`, width: `${indicator().width}px` }}
        />
        <For each={items()}>
          {(item, index) => (
            <button
              ref={(node) => {
                buttons[index()] = node;
              }}
              type="button"
              role="tab"
              aria-selected={item.value === current()}
              tabIndex={item.value === current() ? 0 : -1}
              onClick={() => select(item.value)}
              onKeyDown={(event) => onKey(event, index())}
              class={`relative flex-1 rounded-md px-3 py-1.5 text-[13px] outline-none transition-colors duration-200 ${
                item.value === current()
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          )}
        </For>
      </div>
      <div class="relative mt-4 min-h-[72px] overflow-hidden">
        <Show when={active()} keyed>
          {(item) => (
            <div
              role="tabpanel"
              class="tab-panel rounded-lg border bg-background p-4 text-[13px] leading-6 text-muted-foreground outline-none"
            >
              {item.content}
            </div>
          )}
        </Show>
      </div>
      <style>{`
        .tab-panel { animation: tab-in 300ms cubic-bezier(0.25,0.1,0.35,1) both; }
        @keyframes tab-in { from { opacity: 0; transform: translateX(12px); filter: blur(5px); } }
        @media (prefers-reduced-motion: reduce) { .tab-panel { animation: tab-fade 200ms linear both; } @keyframes tab-fade { from { opacity: 0; } } }
      `}</style>
    </div>
  );
}

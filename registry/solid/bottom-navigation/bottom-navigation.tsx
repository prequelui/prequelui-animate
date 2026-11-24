import { For, Show, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { Accessor, Component } from "solid-js";
import { animate } from "motion";
import { Bell, Compass, Home, User } from "lucide-solid";

export type BottomNavigationItemData = {
  value: string;
  label: string;
  icon?: Component<any>;
};

export type BottomNavigationProps = {
  items?: BottomNavigationItemData[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  hideOnScroll?: boolean;
  class?: string;
};

const fallbackItems: BottomNavigationItemData[] = [
  { value: "home", label: "Home", icon: Home },
  { value: "explore", label: "Explore", icon: Compass },
  { value: "alerts", label: "Alerts", icon: Bell },
  { value: "you", label: "You", icon: User },
];

const selectionSpring = { type: "spring" as const, stiffness: 300, damping: 30 };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function BottomNavigation(props: BottomNavigationProps) {
  const items = () => props.items ?? fallbackItems;
  const [internal, setInternal] = createSignal(
    props.defaultValue ?? items()[0]?.value ?? "",
  );
  const current = createMemo(() => props.value ?? internal());
  const [hidden, setHidden] = createSignal(false);

  let nav: HTMLElement | undefined;
  let indicator: HTMLSpanElement | undefined;
  let ready = false;
  let lastY = 0;
  let currentLeft = 0;
  let currentWidth = 0;
  let navControls: ReturnType<typeof animate> | undefined;
  let observer: ResizeObserver | undefined;

  const select = (next: string) => {
    setInternal(next);
    props.onValueChange?.(next);
  };

  const measure = (animated: boolean) => {
    if (!nav || !indicator) return;
    const index = items().findIndex((item) => item.value === current());
    const nodes = nav.querySelectorAll<HTMLElement>("[data-nav-item]");
    const node = nodes[index];
    if (!node) return;

    const left = node.offsetLeft;
    const width = node.offsetWidth;
    if (!animated || reduce()) {
      currentLeft = left;
      currentWidth = width;
      indicator.style.left = `${left}px`;
      indicator.style.width = `${width}px`;
      return;
    }

    animate(
      indicator,
      { left: [currentLeft, left], width: [currentWidth, width] },
      selectionSpring,
    );
    currentLeft = left;
    currentWidth = width;
  };

  const onScroll = () => {
    const y = window.scrollY;
    setHidden(y > 24 && y > lastY);
    lastY = y;
  };

  createEffect(() => {
    current();
    if (!ready) return;
    queueMicrotask(() => measure(true));
  });

  createEffect(() => {
    const isHidden = hidden();
    if (!nav) return;
    navControls?.stop?.();
    navControls = animate(
      nav,
      { y: isHidden && !reduce() ? 110 : 0 },
      reduce() ? { duration: 0 } : selectionSpring,
    );
  });

  onMount(() => {
    ready = true;
    measure(false);
    if (nav) {
      observer = new ResizeObserver(() => measure(false));
      observer.observe(nav);
    }
    if (props.hideOnScroll) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  });

  onCleanup(() => {
    if (typeof window === "undefined") return;
    observer?.disconnect();
    navControls?.stop?.();
    window.removeEventListener("scroll", onScroll);
  });

  return (
    <nav
      ref={(node: HTMLElement) => (nav = node)}
      data-slot="bottom-navigation"
      class={`relative flex w-full max-w-[340px] items-center justify-between gap-1 rounded-2xl border bg-background p-1.5 shadow-sm ${props.class ?? ""}`}
    >
      <span
        ref={(node: HTMLSpanElement) => (indicator = node)}
        aria-hidden="true"
        class="absolute bottom-1.5 top-1.5 z-0 rounded-xl bg-accent"
        style={{ left: "0", width: "0" }}
      />
      <For each={items()}>
        {(item) => {
          const active = () => current() === item.value;
          return (
            <button
              type="button"
              data-nav-item
              aria-current={active() ? "page" : undefined}
              data-state={active() ? "active" : "inactive"}
              onClick={() => select(item.value)}
              class={`relative z-10 flex h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 ${
                active()
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span class="relative flex items-center justify-center [&_svg]:size-4">
                <Show when={item.icon}>
                  {(icon: Accessor<Component<any>>) => {
                    const Icon = icon();
                    return <Icon aria-hidden="true" />;
                  }}
                </Show>
              </span>
              <span class="relative text-[13px] font-medium">{item.label}</span>
            </button>
          );
        }}
      </For>
    </nav>
  );
}

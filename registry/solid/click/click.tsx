import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import { Portal } from "solid-js/web";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type ClickVariant = "ripple" | "ring" | "crosshair" | "burst" | "particles";

export type ClickProps = {
  variant?: ClickVariant;
  color?: string;
  size?: number;
  duration?: number;
  disabled?: boolean;
  scope?: HTMLElement | (() => HTMLElement | null) | null;
  children?: JSX.Element;
};

type ClickItem = {
  id: number;
  x: number;
  y: number;
  variant: ClickVariant;
  color: string;
  size: number;
  duration: number;
};

const crossDirections = [
  { dx: 1, dy: 0, rotate: 0 },
  { dx: -1, dy: 0, rotate: 0 },
  { dx: 0, dy: -1, rotate: 90 },
  { dx: 0, dy: 1, rotate: 90 },
];

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ringGeometry = (item: ClickItem) => {
  const end = Math.max(item.size / 1.5, 50);
  return {
    end,
    start: Math.max(end * 0.2, 12),
    stroke: Math.max(end * 0.05, 2.5),
  };
};

const crossGeometry = (item: ClickItem) => {
  const distance = Math.max(item.size * 0.65, 56);
  const gap = Math.max(item.size * 0.05, 3);
  const lengthStart = Math.max(item.size * 0.26, 16);
  const lengthEnd = Math.max(lengthStart * 0.55, 6);
  const strokeWidth = Math.max(item.size * 0.065, 2);
  const half = distance + gap + lengthStart;
  return { distance, gap, lengthStart, lengthEnd, strokeWidth, half };
};

const burstGeometry = (item: ClickItem) => {
  const start = Math.max(item.size * 0.4, 36);
  const end = Math.max(item.size * 0.65, 56);
  const lengthStart = Math.max(item.size * 0.2, 14);
  const lengthEnd = Math.max(lengthStart * 0.5, 6);
  const strokeWidth = Math.max(item.size * 0.05, 1.5);
  const half = end + lengthStart;
  return { start, end, lengthStart, lengthEnd, strokeWidth, half };
};

const particleGeometry = (item: ClickItem) => {
  const dot = Math.max(item.size * 0.025, 2.5);
  const radius = item.size * 0.35;
  return { dot, radius, half: radius + dot * 2 };
};

const rootStyle = (item: ClickItem): JSX.CSSProperties => {
  const base: JSX.CSSProperties = { position: "fixed", overflow: "visible" };

  if (item.variant === "ripple") {
    return {
      ...base,
      left: `${item.x - item.size / 2}px`,
      top: `${item.y - item.size / 2}px`,
      width: `${item.size}px`,
      height: `${item.size}px`,
    };
  }

  if (item.variant === "ring") {
    const ring = ringGeometry(item);
    return {
      ...base,
      left: `${item.x - ring.end / 2}px`,
      top: `${item.y - ring.end / 2}px`,
      width: `${ring.end}px`,
      height: `${ring.end}px`,
    };
  }

  if (item.variant === "crosshair") {
    const cross = crossGeometry(item);
    return {
      ...base,
      left: `${item.x - cross.half}px`,
      top: `${item.y - cross.half}px`,
      width: `${cross.half * 2}px`,
      height: `${cross.half * 2}px`,
      transform: "rotate(-25deg)",
    };
  }

  if (item.variant === "burst") {
    const burst = burstGeometry(item);
    return {
      ...base,
      left: `${item.x - burst.half}px`,
      top: `${item.y - burst.half}px`,
      width: `${burst.half * 2}px`,
      height: `${burst.half * 2}px`,
    };
  }

  const particle = particleGeometry(item);
  return {
    ...base,
    left: `${item.x - particle.half}px`,
    top: `${item.y - particle.half}px`,
    width: `${particle.half * 2}px`,
    height: `${particle.half * 2}px`,
  };
};

const ringPartStyle = (item: ClickItem): JSX.CSSProperties => {
  const ring = ringGeometry(item);
  return {
    width: "100%",
    height: "100%",
    borderRadius: "9999px",
    borderStyle: "solid",
    borderColor: item.color,
    borderWidth: `${ring.stroke}px`,
    transform: `scale(${ring.start / ring.end})`,
  };
};

const crossPartStyle = (item: ClickItem): JSX.CSSProperties => {
  const cross = crossGeometry(item);
  return {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: `${cross.lengthStart}px`,
    height: `${cross.strokeWidth}px`,
    marginLeft: `${-cross.lengthStart / 2}px`,
    marginTop: `${-cross.strokeWidth / 2}px`,
    background: item.color,
    borderRadius: "9999px",
  };
};

const burstPartStyle = (item: ClickItem): JSX.CSSProperties => {
  const burst = burstGeometry(item);
  return {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: `${burst.lengthStart}px`,
    height: `${burst.strokeWidth}px`,
    marginLeft: `${-burst.lengthStart / 2}px`,
    marginTop: `${-burst.strokeWidth / 2}px`,
    background: item.color,
    borderRadius: "9999px",
  };
};

const particlePartStyle = (item: ClickItem): JSX.CSSProperties => {
  const particle = particleGeometry(item);
  return {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: `${particle.dot}px`,
    height: `${particle.dot}px`,
    marginLeft: `${-particle.dot / 2}px`,
    marginTop: `${-particle.dot / 2}px`,
    borderRadius: "9999px",
    background: item.color,
    opacity: 0,
  };
};

export function Click(props: ClickProps) {
  const [items, setItems] = createSignal<ClickItem[]>([]);
  const [mounted, setMounted] = createSignal(false);
  const timers = new Set<ReturnType<typeof setTimeout>>();
  let controls: Array<ReturnType<typeof animate>> = [];
  let nextId = 0;

  const animateItem = (item: ClickItem) => {
    const node = document.querySelector<HTMLElement>(`[data-click-id="${item.id}"]`);
    if (!node) return;
    const parts = Array.from(node.querySelectorAll<HTMLElement>("[data-part]"));
    const seconds = item.duration / 1000;

    if (item.variant === "ripple") {
      for (const part of parts) {
        controls.push(
          animate(part, { opacity: [0.9, 0], scale: [0.2, 1] }, { duration: seconds, ease: "easeOut" }),
        );
      }
      return;
    }

    if (item.variant === "ring") {
      const ring = ringGeometry(item);
      for (const part of parts) {
        controls.push(
          animate(
            part,
            {
              scale: [ring.start / ring.end, 1],
              borderWidth: [ring.stroke, 0],
              opacity: [1, 0.9, 0],
            },
            { duration: seconds, ease: "easeOut" },
          ),
        );
      }
      return;
    }

    if (item.variant === "crosshair") {
      const cross = crossGeometry(item);
      parts.forEach((part, index) => {
        const direction = crossDirections[index] ?? crossDirections[0]!;
        controls.push(
          animate(
            part,
            {
              x: [direction.dx * cross.gap, direction.dx * cross.distance],
              y: [direction.dy * cross.gap, direction.dy * cross.distance],
              rotate: direction.rotate,
              scale: [1, 0],
              opacity: [1, 0],
            },
            { duration: seconds, ease: [0, 0, 0.7, 1] },
          ),
        );
      });
      return;
    }

    if (item.variant === "burst") {
      const burst = burstGeometry(item);
      const count = 8;
      parts.forEach((part, index) => {
        const angle = (index / count) * Math.PI * 2;
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        controls.push(
          animate(
            part,
            {
              x: [dx * burst.start, dx * burst.end],
              y: [dy * burst.start, dy * burst.end],
              rotate: (angle * 180) / Math.PI,
              scaleX: [1, burst.lengthEnd / burst.lengthStart],
              opacity: [1, 1, 0],
            },
            { duration: seconds, ease: "easeInOut" },
          ),
        );
      });
      return;
    }

    const particle = particleGeometry(item);
    const count = 8;
    parts.forEach((part, index) => {
      const angle = (index / count) * Math.PI * 2;
      controls.push(
        animate(
          part,
          {
            x: Math.cos(angle) * particle.radius,
            y: Math.sin(angle) * particle.radius,
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          },
          {
            duration: seconds,
            delay: index * seconds * 0.06,
            ease: "easeOut",
          },
        ),
      );
    });
  };

  const add = (event: PointerEvent) => {
    if (props.disabled || reduce()) return;

    const scope = typeof props.scope === "function" ? props.scope() : props.scope;
    if (scope && scope !== document.body) {
      const rect = scope.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        return;
      }
    }

    const id = nextId;
    nextId += 1;
    const item: ClickItem = {
      id,
      x: event.clientX,
      y: event.clientY,
      variant: props.variant ?? "ring",
      color: props.color ?? "currentColor",
      size: props.size ?? 100,
      duration: props.duration ?? 400,
    };
    setItems((current) => [...current, item]);

    queueMicrotask(() => animateItem(item));

    const timer = setTimeout(() => {
      timers.delete(timer);
      setItems((current) => current.filter((entry) => entry.id !== id));
    }, (props.duration ?? 400) + 320);
    timers.add(timer);
  };

  onMount(() => {
    setMounted(true);
    document.addEventListener("pointerup", add, { passive: true });
  });

  onCleanup(() => {
    if (typeof window === "undefined") return;
    document.removeEventListener("pointerup", add);
    for (const timer of timers) clearTimeout(timer);
    timers.clear();
    for (const control of controls) control?.stop?.();
    controls = [];
  });

  return (
    <>
      <span data-slot="click" style={{ display: "contents" }}>
        {props.children}
      </span>
      <Show when={mounted()}>
        <Portal>
          <div
            aria-hidden="true"
            style={{
              position: "fixed",
              inset: 0,
              "pointer-events": "none",
              "z-index": 9999,
            }}
          >
            <For each={items()}>
              {(item: ClickItem) => (
                <div data-click-id={item.id} style={rootStyle(item)}>
                  <Show when={item.variant === "ripple"}>
                    <span
                      data-part
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        borderRadius: "9999px",
                        background: item.color,
                        boxShadow: `inset 0 0 0 2px ${item.color}`,
                      }}
                    />
                  </Show>
                  <Show when={item.variant === "ring"}>
                    <span data-part style={ringPartStyle(item)} />
                  </Show>
                  <Show when={item.variant === "crosshair"}>
                    <For each={crossDirections}>
                      {() => <span data-part style={crossPartStyle(item)} />}
                    </For>
                  </Show>
                  <Show when={item.variant === "burst"}>
                    <For each={Array.from({ length: 8 }, (_, index) => index)}>
                      {() => <span data-part style={burstPartStyle(item)} />}
                    </For>
                  </Show>
                  <Show when={item.variant === "particles"}>
                    <For each={Array.from({ length: 8 }, (_, index) => index)}>
                      {() => <span data-part style={particlePartStyle(item)} />}
                    </For>
                  </Show>
                </div>
              )}
            </For>
          </div>
        </Portal>
      </Show>
    </>
  );
}

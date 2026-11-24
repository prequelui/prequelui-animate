import { animate } from "motion";
import { Show, createSignal } from "solid-js";
import type { JSX } from "solid-js";

export type CursorProps = {
  label?: string;
  dotSize?: number;
  labelGap?: number;
  hideNative?: boolean;
  class?: string;
  children?: JSX.Element;
};

export function Cursor(props: CursorProps) {
  let root: HTMLDivElement | undefined;
  let dot: HTMLSpanElement | undefined;
  let tip: HTMLSpanElement | undefined;
  const [inside, setInside] = createSignal(false);
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const show = () => {
    setInside(true);
    queueMicrotask(() => {
      if (!dot) return;
      const options = reduce()
        ? { duration: 0 }
        : { type: "spring" as const, stiffness: 550, damping: 30, restSpeed: 10 };
      animate(dot, { scale: [0, 1], opacity: [0, 1] }, options);
      if (tip) {
        animate(
          tip,
          { scale: [0.8, 1], opacity: [0, 1] },
          reduce()
            ? { duration: 0 }
            : { type: "spring" as const, stiffness: 550, damping: 46.9, restSpeed: 10 },
        );
      }
    });
  };

  const hide = () => {
    if (!dot) {
      setInside(false);
      return;
    }
    const options = reduce()
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: 550, damping: 46.9, restSpeed: 10 };
    const controls = [animate(dot, { scale: 0, opacity: 0 }, options)];
    if (tip) {
      controls.push(animate(tip, { scale: 0.8, opacity: 0 }, options));
    }
    Promise.all(controls.map((control) => control.finished)).then(() =>
      setInside(false),
    );
  };

  const move = (event: PointerEvent) => {
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const size = props.dotSize ?? 12;
    if (dot) {
      dot.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`;
    }
    if (tip) {
      animate(
        tip,
        { x: x + (props.labelGap ?? 14), y: y + (props.labelGap ?? 14) - 8 },
        reduce()
          ? { duration: 0 }
          : { type: "spring", stiffness: 500, damping: 50, bounce: 0 },
      );
    }
  };

  return (
    <div
      ref={root}
      data-slot="cursor"
      class={`relative ${props.hideNative === false ? "" : "cursor-none"} ${props.class ?? ""}`}
      onPointerMove={move}
      onPointerEnter={show}
      onPointerLeave={hide}
    >
      {props.children}
      <Show when={inside()}>
        <span
          ref={dot}
          aria-hidden="true"
          data-slot="cursor-dot"
          class="pointer-events-none absolute left-0 top-0 z-50 rounded-full bg-foreground"
          style={{
            width: `${props.dotSize ?? 12}px`,
            height: `${props.dotSize ?? 12}px`,
            opacity: 0,
          }}
        />
        <Show when={props.label}>
          <span
            ref={tip}
            aria-hidden="true"
            data-slot="cursor-label"
            class="pointer-events-none absolute left-0 top-0 z-50 whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 text-[13px] font-medium text-background"
            style={{ opacity: 0 }}
          >
            {props.label}
          </span>
        </Show>
      </Show>
    </div>
  );
}

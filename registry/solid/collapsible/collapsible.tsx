import { Show, createEffect, createSignal, on } from "solid-js";
import { animate } from "motion";
import { ChevronDown } from "lucide-solid";

export type CollapsibleProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: string;
  children?: unknown;
  class?: string;
};

const resize = { duration: 0.45, ease: [0.4, 0, 0.1, 1] } as const;

export function Collapsible(props: CollapsibleProps) {
  const [internal, setInternal] = createSignal(props.defaultOpen ?? false);
  const value = () => props.open ?? internal();
  let panel: HTMLDivElement | undefined;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function toggle() {
    const next = !value();
    if (props.open === undefined) setInternal(next);
    props.onOpenChange?.(next);
  }

  createEffect(
    on(
      value,
      (open, previous) => {
        if (!panel || previous === undefined) return;
        if (reduce()) {
          panel.style.height = open ? "auto" : "0px";
          panel.style.opacity = open ? "1" : "0";
          return;
        }
        if (open) {
          panel.style.height = "0px";
          panel.style.opacity = "0";
          const height = panel.scrollHeight;
          animate(panel, { height: ["0px", `${height}px`] }, resize).finished.then(() => {
            if (panel) panel.style.height = "auto";
          });
          animate(panel, { opacity: [0, 1] }, { duration: 0.3, ease: [0.23, 1, 0.32, 1] });
        } else {
          const height = panel.scrollHeight;
          animate(panel, { height: [`${height}px`, "0px"], opacity: [1, 0] }, { duration: 0.3, ease: [0, 0, 0.58, 1] });
        }
      },
      { defer: true },
    ),
  );

  return (
    <div data-slot="collapsible" class={`w-full ${props.class ?? ""}`}>
      <button
        type="button"
        aria-expanded={value()}
        aria-controls="collapsible-panel"
        onClick={toggle}
        class="flex w-full items-center justify-between gap-4 py-3 text-left text-[13.5px] font-medium outline-none"
      >
        <span>{props.trigger ?? "Show details"}</span>
        <ChevronDown
          aria-hidden="true"
          class="size-4 text-muted-foreground transition-transform duration-[450ms]"
          style={{
            "transition-timing-function": "cubic-bezier(0.4,0,0.1,1)",
            transform: `rotate(${value() ? 180 : 0}deg)`,
          }}
        />
      </button>
      <Show when={value()}>
        <div
          ref={panel}
          id="collapsible-panel"
          role="region"
          class="overflow-hidden"
          style={{
            height: value() ? "auto" : "0px",
            opacity: value() ? 1 : 0,
          }}
        >
          <div class="pb-3 text-[13px] leading-6 text-muted-foreground">
            {props.children as never}
          </div>
        </div>
      </Show>
    </div>
  );
}

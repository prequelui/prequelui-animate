import { For, createEffect, createSignal, on } from "solid-js";
import { animate } from "motion";
import { ChevronDown } from "lucide-solid";

export type AccordionItemData = {
  value: string;
  title: string;
  content: string;
};

export type AccordionProps = {
  items: AccordionItemData[];
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  collapsible?: boolean;
  class?: string;
};

const ease = [0.215, 0.61, 0.355, 1] as const;

function toArray(value: string | string[] | undefined) {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function Row(props: {
  item: AccordionItemData;
  open: boolean;
  onToggle: (value: string) => void;
}) {
  let panel: HTMLDivElement | undefined;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const initial = {
    height: props.open ? "auto" : "0px",
    opacity: props.open ? 1 : 0,
    filter: props.open ? "blur(0px)" : "blur(2px)",
    overflow: "hidden",
  };

  createEffect(
    on(
      () => props.open,
      (open, previous) => {
        if (!panel || previous === undefined) return;
        if (reduce()) {
          panel.style.height = open ? "auto" : "0px";
          panel.style.opacity = open ? "1" : "0";
          panel.style.filter = "blur(0px)";
          return;
        }
        if (open) {
          panel.style.height = "0px";
          panel.style.opacity = "0";
          panel.style.filter = "blur(2px)";
          const height = panel.scrollHeight;
          animate(
            panel,
            { height: ["0px", `${height}px`] },
            { type: "spring", stiffness: 300, damping: 30, bounce: 0 },
          ).finished.then(() => {
            if (panel) panel.style.height = "auto";
          });
          animate(
            panel,
            { opacity: [0, 1], filter: ["blur(2px)", "blur(0px)"] },
            { duration: 0.25, ease },
          );
        } else {
          const height = panel.scrollHeight;
          animate(
            panel,
            { height: [`${height}px`, "0px"] },
            { type: "spring", stiffness: 300, damping: 30, bounce: 0 },
          );
          animate(
            panel,
            { opacity: [1, 0], filter: ["blur(0px)", "blur(2px)"] },
            { duration: 0.25, ease },
          );
        }
      },
      { defer: true },
    ),
  );

  return (
    <div
      data-slot="accordion-item"
      data-state={props.open ? "open" : "closed"}
      class="border-b last:border-b-0"
    >
      <button
        type="button"
        aria-expanded={props.open}
        aria-controls={`accordion-${props.item.value}`}
        onClick={() => props.onToggle(props.item.value)}
        class="flex w-full items-center justify-between gap-4 py-3.5 text-left text-[13.5px] font-medium outline-none transition-colors focus-visible:text-foreground"
      >
        <span>{props.item.title}</span>
        <ChevronDown
          aria-hidden="true"
          class="size-4 text-muted-foreground transition-transform duration-[350ms]"
          style={{
            "transition-timing-function": "cubic-bezier(0.215,0.61,0.355,1)",
            transform: `rotate(${props.open ? 180 : 0}deg)`,
          }}
        />
      </button>
      <div
        ref={panel}
        id={`accordion-${props.item.value}`}
        role="region"
        style={initial}
      >
        <div class="pb-4 pr-6 text-[13px] leading-6 text-muted-foreground">
          {props.item.content}
        </div>
      </div>
    </div>
  );
}

export function Accordion(props: AccordionProps) {
  const [open, setOpen] = createSignal<string[]>(toArray(props.defaultValue));
  const type = props.type ?? "single";
  const collapsible = props.collapsible ?? true;

  function toggle(value: string) {
    const isOpen = open().includes(value);
    if (type === "single") {
      setOpen(isOpen ? (collapsible ? [] : open()) : [value]);
    } else {
      setOpen(
        isOpen ? open().filter((entry) => entry !== value) : [...open(), value],
      );
    }
  }

  return (
    <div data-slot="accordion" class={`w-full ${props.class ?? ""}`}>
      <For each={props.items}>
        {(item) => (
          <Row
            item={item}
            open={open().includes(item.value)}
            onToggle={toggle}
          />
        )}
      </For>
    </div>
  );
}

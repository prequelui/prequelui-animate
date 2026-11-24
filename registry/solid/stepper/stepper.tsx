import { For, Show, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type StepperStep = {
  id: string;
  title: string;
  description?: string;
  content?: string | JSX.Element;
};

export type StepperProps = {
  steps?: StepperStep[];
  value?: number;
  defaultValue?: number;
  onValueChange?: (index: number) => void;
  controls?: boolean;
  backLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  onComplete?: () => void;
  minHeight?: number;
  class?: string;
  children?:
    | JSX.Element
    | ((args: { step: StepperStep; index: number }) => JSX.Element);
};

const fallbackSteps: StepperStep[] = [
  {
    id: "account",
    title: "Account",
    description: "Your details",
    content:
      "Create your account. Use an email you can access. You can change it later.",
  },
  {
    id: "workspace",
    title: "Workspace",
    description: "Name and invite",
    content:
      "Set up the workspace. Invite a teammate or start on your own.",
  },
  {
    id: "ready",
    title: "Ready",
    description: "Start building",
    content:
      "Everything is ready. Your first project is waiting on the dashboard.",
  },
];

const clamp = (value: number, max: number) => Math.min(max, Math.max(0, value));

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const nextTick = () =>
  new Promise<void>((resolve) => queueMicrotask(resolve));

function StepCheck() {
  let path: SVGPathElement | undefined;
  onMount(() => {
    if (!path) return;
    if (reduce()) {
      path.style.strokeDashoffset = "0";
      return;
    }
    animate(
      path,
      { strokeDashoffset: [1, 0] },
      { duration: 0.28, ease: [0.23, 1, 0.32, 1] },
    );
  });
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-3.5">
      <path
        ref={(node: SVGPathElement) => (path = node)}
        d="M3.4 8.4 6.6 11.5 12.6 4.8"
        stroke="currentColor"
        stroke-width="1.9"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray="1"
        stroke-dashoffset="1"
      />
    </svg>
  );
}

export function Stepper(props: StepperProps) {
  const steps = () => props.steps ?? fallbackSteps;
  const last = createMemo(() => Math.max(0, steps().length - 1));
  const [internal, setInternal] = createSignal(
    clamp(props.defaultValue ?? 0, Math.max(0, steps().length - 1)),
  );
  const current = createMemo(() => clamp(props.value ?? internal(), last()));
  const [displayed, setDisplayed] = createSignal(current());
  const shownStep = createMemo(() => steps()[displayed()]);

  let panel: HTMLDivElement | undefined;
  let panelControls: ReturnType<typeof animate> | undefined;
  let transitioning = false;
  let queued: number | null = null;
  let currentTarget = current();

  const stopPanel = () => {
    panelControls?.stop?.();
  };

  const transitionTo = async (target: number) => {
    if (transitioning) {
      queued = target;
      return;
    }
    if (target === displayed()) return;
    if (!panel) {
      setDisplayed(target);
      return;
    }

    transitioning = true;
    const direction = target >= displayed() ? 1 : -1;
    const rest = reduce();
    stopPanel();

    try {
      if (rest) {
        panelControls = animate(panel, { opacity: [1, 0] }, { duration: 0.15 });
        await panelControls.finished;
        setDisplayed(target);
        await nextTick();
        if (panel) {
          panelControls = animate(
            panel,
            { opacity: [0, 1] },
            { duration: 0.15 },
          );
          await panelControls.finished;
        }
      } else {
        panelControls = animate(
          panel,
          {
            opacity: [1, 0],
            x: [0, direction * -18],
            filter: ["blur(0px)", "blur(2px)"],
          },
          { duration: 0.26, ease: [0.23, 1, 0.32, 1] },
        );
        await panelControls.finished;
        setDisplayed(target);
        await nextTick();
        if (panel) {
          panelControls = animate(
            panel,
            {
              opacity: [0, 1],
              x: [direction * 18, 0],
              filter: ["blur(3px)", "blur(0px)"],
            },
            { duration: 0.26, ease: [0.23, 1, 0.32, 1] },
          );
          await panelControls.finished;
        }
      }
    } finally {
      transitioning = false;
      if (queued !== null) {
        const next = queued;
        queued = null;
        if (next !== displayed()) transitionTo(next);
      }
    }
  };

  createEffect(() => {
    const target = current();
    if (target === currentTarget) return;
    currentTarget = target;
    queueMicrotask(() => transitionTo(target));
  });

  const go = (next: number) => {
    const safe = clamp(next, last());
    if (safe === current()) return;
    if (props.value === undefined) setInternal(safe);
    props.onValueChange?.(safe);
  };

  const complete = () => {
    if (current() === last()) props.onComplete?.();
    else go(current() + 1);
  };

  const badgeClass = (index: number) => {
    if (index < current())
      return "border-primary bg-primary text-primary-foreground";
    if (index === current())
      return "border-primary bg-background text-foreground";
    return "border-border bg-muted/40 text-muted-foreground";
  };

  onCleanup(() => {
    stopPanel();
    queued = null;
  });

  return (
    <div
      data-slot="stepper"
      class={`w-full max-w-[440px] ${props.class ?? ""}`}
    >
      <ol class="flex w-full items-start" aria-label="Progress">
        <For each={steps()}>
          {(item, index) => (
            <li class="relative flex min-w-0 flex-1 flex-col items-center">
              <Show when={index() < steps().length - 1}>
                <span
                  aria-hidden="true"
                  class="absolute left-1/2 top-[15px] -ml-px h-px w-full overflow-hidden bg-border"
                >
                  <span
                    class="block h-full w-full origin-left bg-primary transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.1,1)] motion-reduce:transition-none"
                    style={{
                      transform: `scaleX(${index() < current() ? 1 : 0})`,
                    }}
                  />
                </span>
              </Show>
              <button
                type="button"
                aria-current={index() === current() ? "step" : undefined}
                aria-label={`Step ${index() + 1}: ${item.title}`}
                onClick={() => go(index())}
                class="group relative z-10 flex flex-col items-center gap-2 rounded-lg px-1 py-0.5 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <span
                  class={`flex size-[30px] items-center justify-center rounded-full border text-[13px] font-medium transition-[color,background-color,border-color,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${badgeClass(index())}`}
                  style={{
                    transform: `scale(${index() === current() && !reduce() ? 1.08 : 1})`,
                  }}
                >
                  <Show when={index() < current()} fallback={index() + 1}>
                    <StepCheck />
                  </Show>
                </span>
                <span class="flex min-w-0 flex-col">
                  <span
                    class={`truncate text-[13px] leading-4 ${
                      index() <= current()
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.title}
                  </span>
                  <Show when={item.description}>
                    <span class="mt-0.5 hidden truncate text-[13px] leading-4 text-muted-foreground sm:block">
                      {item.description}
                    </span>
                  </Show>
                </span>
              </button>
            </li>
          )}
        </For>
      </ol>

      <div
        class="relative mt-6 overflow-hidden rounded-xl border bg-background"
        style={{ "min-height": `${props.minHeight ?? 112}px` }}
      >
        <div
          ref={(node: HTMLDivElement) => (panel = node)}
          role="region"
          aria-live="polite"
          aria-label={shownStep() ? `${shownStep()!.title} step` : undefined}
          class="p-4 text-[13px] leading-5 text-muted-foreground"
        >
          {typeof props.children === "function" ? (
            props.children({
              step: shownStep() as StepperStep,
              index: displayed(),
            })
          ) : (
            props.children ?? (
              <Show
                when={shownStep()?.content}
                fallback={<p class="text-foreground">{shownStep()?.title}</p>}
              >
                {(content: () => string | JSX.Element) =>
                  typeof content() === "string" ? (
                    <p>{content()}</p>
                  ) : (
                    content()
                  )
                }
              </Show>
            )
          )}
        </div>
      </div>

      <Show when={props.controls !== false}>
        <div class="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => go(current() - 1)}
            disabled={current() === 0}
            class="inline-flex h-9 items-center justify-center rounded-lg border px-3 text-[13px] font-medium transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
          >
            {props.backLabel ?? "Back"}
          </button>
          <span class="text-[13px] tabular-nums text-muted-foreground">
            {Math.min(current() + 1, steps().length)} / {steps().length}
          </span>
          <button
            type="button"
            onClick={complete}
            class="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {current() === last()
              ? (props.finishLabel ?? "Finish")
              : (props.nextLabel ?? "Continue")}
          </button>
        </div>
      </Show>
    </div>
  );
}

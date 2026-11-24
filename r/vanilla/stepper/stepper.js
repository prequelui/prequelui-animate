import { animate } from "motion";

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (value, max) => Math.min(max, Math.max(0, value));

const CHECK_ICON = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-3.5">
  <path data-check-path d="M3.4 8.4 6.6 11.5 12.6 4.8" stroke="currentColor" stroke-width="1.9"
    stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" />
</svg>`;

let uid = 0;

export function createStepper(root, options = {}) {
  const {
    steps = [],
    defaultValue = 0,
    controls = true,
    backLabel = "Back",
    nextLabel = "Continue",
    finishLabel = "Finish",
    onComplete,
    minHeight = 112,
    className = "",
  } = options;
  const last = Math.max(0, steps.length - 1);
  let current = clamp(defaultValue, last);
  let panelControl;
  const base = `stepper-${++uid}`;

  root.innerHTML = `
    <div data-slot="stepper" class="w-full max-w-[440px] ${className}">
      <ol data-steps class="flex w-full items-start" aria-label="Progress"></ol>
      <div class="relative mt-6 overflow-hidden rounded-xl border bg-background" style="min-height:${minHeight}px">
        <div data-panel role="region" aria-live="polite" class="p-4 text-[13px] leading-5 text-muted-foreground"></div>
      </div>
      ${
        controls
          ? `<div class="mt-4 flex items-center justify-between gap-3">
        <button type="button" data-back class="inline-flex h-9 items-center justify-center rounded-lg border px-3 text-[13px] font-medium transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40">${backLabel}</button>
        <span data-count class="text-[13px] tabular-nums text-muted-foreground"></span>
        <button type="button" data-next class="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90">${nextLabel}</button>
      </div>`
          : ""
      }
    </div>`;

  const host = root.querySelector("[data-slot]");
  const list = root.querySelector("[data-steps]");
  const panel = root.querySelector("[data-panel]");
  const back = root.querySelector("[data-back]");
  const next = root.querySelector("[data-next]");
  const counter = root.querySelector("[data-count]");
  let direction = 1;
  let previous = current;
  let checkControls = [];

  function stateOf(index) {
    if (index < current) return "complete";
    if (index === current) return "current";
    return "upcoming";
  }

  function renderSteps() {
    list.innerHTML = steps
      .map((item, index) => {
        const state = stateOf(index);
        const dotClass =
          state === "complete"
            ? "border-primary bg-primary text-primary-foreground"
            : state === "current"
              ? "border-primary bg-background text-foreground"
              : "border-border bg-muted/40 text-muted-foreground";
        const labelClass =
          state === "upcoming"
            ? "text-muted-foreground"
            : "font-medium text-foreground";
        const connector =
          index < last
            ? `<span aria-hidden="true" class="absolute left-1/2 top-[15px] -ml-px h-px w-full overflow-hidden bg-border">
            <span data-connector style="transform:scaleX(${index < current ? 1 : 0});transform-origin:left;transition:transform 400ms cubic-bezier(0.4,0,0.1,1)" class="block h-full w-full bg-primary"></span>
          </span>`
            : "";
        return `
          <li class="relative flex min-w-0 flex-1 flex-col items-center">
            ${connector}
            <button type="button" data-step="${index}" ${state === "current" ? 'aria-current="step"' : ""}
              aria-label="Step ${index + 1}: ${item.title}"
              class="group relative z-10 flex flex-col items-center gap-2 rounded-lg px-1 py-0.5 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
              <span data-dot class="flex size-[30px] items-center justify-center rounded-full border text-[13px] font-medium transition-colors ${dotClass}"
                style="transform:scale(${state === "current" && !reduce() ? 1.08 : 1})">
                ${state === "complete" ? CHECK_ICON : index + 1}
              </span>
              <span class="flex min-w-0 flex-col">
                <span class="truncate text-[13px] leading-4 ${labelClass}">${item.title}</span>
                ${
                  item.description
                    ? `<span class="mt-0.5 hidden truncate text-[13px] leading-4 text-muted-foreground sm:block">${item.description}</span>`
                    : ""
                }
              </span>
            </button>
          </li>`;
      })
      .join("");

    checkControls.forEach((control) => control.stop?.());
    checkControls = [];
    if (!reduce()) {
      list.querySelectorAll("[data-check-path]").forEach((path) => {
        checkControls.push(
          animate(
            path,
            { pathLength: [0, 1] },
            { duration: 0.28, ease: [0.23, 1, 0.32, 1] },
          ),
        );
      });
    } else {
      list.querySelectorAll("[data-check-path]").forEach((path) => {
        path.style.strokeDashoffset = "0";
      });
    }
  }

  function panelContent(step) {
    return step?.content ?? `<p class="text-foreground">${step?.title ?? ""}</p>`;
  }

  function paintPanel(initial = false) {
    const step = steps[current];
    panelControl?.stop?.();
    const still = reduce();
    const enter = () => {
      panel.innerHTML = panelContent(step);
      panel.id = `${base}-${step?.id ?? current}`;
      panel.setAttribute("aria-label", step ? `${step.title} step` : "");
      if (initial) return;
      panelControl = animate(
        panel,
        still
          ? { opacity: [0, 1] }
          : { opacity: [0, 1], x: [direction * 18, 0], filter: ["blur(3px)", "blur(0px)"] },
        { duration: still ? 0.15 : 0.26, ease: [0.23, 1, 0.32, 1] },
      );
    };

    if (initial) {
      enter();
      return;
    }

    panelControl = animate(
      panel,
      still
        ? { opacity: 0 }
        : { opacity: 0, x: direction * -18, filter: "blur(2px)" },
      { duration: still ? 0.15 : 0.13, ease: [0.23, 1, 0.32, 1] },
    );
    panelControl.finished.then(enter);
  }

  function paintCounter() {
    if (!counter) return;
    counter.textContent = `${Math.min(current + 1, steps.length)} / ${steps.length}`;
  }

  function paintNext() {
    if (!next) return;
    next.textContent = current === last ? finishLabel : nextLabel;
  }

  function go(target) {
    const safe = clamp(target, last);
    if (safe === current) return;
    direction = safe >= previous ? 1 : -1;
    previous = current;
    current = safe;
    renderSteps();
    paintPanel();
    paintCounter();
    paintNext();
    if (back) back.disabled = current === 0;
  }

  function onListClick(event) {
    const button = event.target.closest("[data-step]");
    if (!button) return;
    go(Number(button.dataset.step));
  }

  list.addEventListener("click", onListClick);
  if (back) back.addEventListener("click", () => go(current - 1));
  if (next)
    next.addEventListener("click", () => {
      if (current === last) onComplete?.();
      else go(current + 1);
    });

  renderSteps();
  paintPanel(true);
  paintCounter();
  paintNext();
  if (back) back.disabled = current === 0;

  return {
    element: host,
    go(index) {
      go(index);
    },
    get value() {
      return current;
    },
    destroy() {
      panelControl?.stop?.();
      checkControls.forEach((control) => control.stop?.());
      list.removeEventListener("click", onListClick);
      root.innerHTML = "";
    },
  };
}

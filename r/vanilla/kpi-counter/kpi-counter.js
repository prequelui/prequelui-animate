import { animate } from "motion";

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function formatNumber(value, decimals) {
  const fixed = Math.abs(value).toFixed(decimals);
  const sign = value < 0 && Number(fixed) !== 0 ? "-" : "";
  const [integer = "0", fraction] = fixed.split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+$)/g, ",");
  return fraction ? `${sign}${grouped}.${fraction}` : `${sign}${grouped}`;
}

function springNumber(initial, options) {
  const { stiffness = 90, damping = 50, mass = 1 } = options ?? {};
  let value = initial;
  let velocity = 0;
  let target = initial;
  let frame = null;
  let last = 0;
  let restCallbacks = [];
  const listeners = new Set();
  const emit = () => listeners.forEach((listener) => listener(value));

  function tick(now) {
    if (!last) last = now;
    const elapsed = Math.min(0.064, (now - last) / 1000);
    last = now;
    const steps = Math.max(1, Math.ceil(elapsed / (1 / 240)));
    const step = elapsed / steps;
    for (let index = 0; index < steps; index += 1) {
      const force = -stiffness * (value - target) - damping * velocity;
      velocity += (force / mass) * step;
      value += velocity * step;
    }
    emit();
    if (Math.abs(velocity) < 0.01 && Math.abs(value - target) < 0.001) {
      value = target;
      emit();
      frame = null;
      last = 0;
      const callbacks = restCallbacks;
      restCallbacks = [];
      callbacks.forEach((callback) => callback());
      return;
    }
    frame = requestAnimationFrame(tick);
  }

  return {
    get value() {
      return value;
    },
    setTarget(next, onRest) {
      target = next;
      if (onRest) restCallbacks.push(onRest);
      if (frame === null) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    },
    jump(next) {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      last = 0;
      value = next;
      target = next;
      velocity = 0;
      const callbacks = restCallbacks;
      restCallbacks = [];
      emit();
      callbacks.forEach((callback) => callback());
    },
    subscribe(listener) {
      listeners.add(listener);
    },
    stop() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      last = 0;
    },
  };
}

function smoothPath(points) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midX = (current.x + next.x) / 2;
    d += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
  }
  return d;
}

let uid = 0;

export function createKpiCounter(root, options = {}) {
  const {
    label = "Revenue",
    value = 0,
    from = 0,
    prefix,
    suffix,
    decimals = 0,
    delta,
    deltaSuffix = "%",
    points = [18, 24, 21, 32, 29, 36, 34, 44, 48, 46, 57, 62],
    inView = true,
    hint,
    className = "",
  } = options;
  const width = 240;
  const height = 62;
  const id = ++uid;
  const up = (delta ?? 0) >= 0;
  const arrow = up ? "M3 9 9 3M4.4 3H9v4.6" : "M3 3l6 6M4.4 9H9V4.4";

  let geometry = null;
  if (points.length >= 2) {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const span = max - min || 1;
    const coords = points.map((point, index) => ({
      x: (index / (points.length - 1)) * width,
      y: height - 6 - ((point - min) / span) * (height - 14),
    }));
    const line = smoothPath(coords);
    geometry = {
      line,
      area: `${line} L ${width} ${height} L 0 ${height} Z`,
    };
  }

  root.innerHTML = `
    <div data-slot="kpi-counter"
      class="flex w-full max-w-[300px] flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground ${className}">
      <div class="flex items-start justify-between gap-3">
        <div class="flex min-w-0 flex-col gap-1">
          <span class="truncate text-[13px] leading-4 text-muted-foreground">${label}</span>
          <span class="flex items-baseline gap-0.5 text-[32px] font-medium leading-none tracking-[-0.03em]">
            ${prefix ? `<span class="text-[20px] text-muted-foreground">${prefix}</span>` : ""}
            <span data-count class="inline-block tabular-nums">${formatNumber(from, decimals)}</span>
            ${suffix ? `<span class="text-[15px] font-normal text-muted-foreground">${suffix}</span>` : ""}
          </span>
        </div>
        ${
          delta !== undefined
            ? `<span data-delta
          class="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-[13px] font-medium tabular-nums ${
            up
              ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/12 text-rose-600 dark:text-rose-400"
          }" style="opacity:${reduce() ? 1 : 0};transform:translateY(${reduce() ? 0 : 4}px)">
          <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" class="size-3">
            <path d="${arrow}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          ${Math.abs(delta)}${deltaSuffix}
        </span>`
            : ""
        }
      </div>
      ${
        geometry
          ? `<div class="relative">
        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"
          class="h-[62px] w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="kpi-${id}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="currentColor" stop-opacity="0.26" />
              <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path data-area d="${geometry.area}" fill="url(#kpi-${id})" stroke="none" style="opacity:0"></path>
          <path data-line d="${geometry.line}" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </div>`
          : ""
      }
      ${hint ? `<p class="text-[13px] leading-4 text-muted-foreground">${hint}</p>` : ""}
    </div>`;

  const host = root.querySelector("[data-slot]");
  const countEl = root.querySelector("[data-count]");
  const deltaEl = root.querySelector("[data-delta]");
  const area = root.querySelector("[data-area]");
  const line = root.querySelector("[data-line]");
  const machine = springNumber(from, {});
  let observer;
  let seen = false;
  const controls = [];

  machine.subscribe((latest) => {
    countEl.textContent = formatNumber(latest, decimals);
  });

  function run() {
    if (seen) return;
    seen = true;
    if (reduce()) {
      machine.jump(value);
    } else {
      machine.setTarget(value);
    }

    if (deltaEl) {
      controls.push(
        animate(
          deltaEl,
          { opacity: [0, 1], y: [4, 0] },
          reduce()
            ? { duration: 0 }
            : { duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: 0.15 },
        ),
      );
    }

    if (area) {
      controls.push(
        animate(
          area,
          { opacity: [0, 1] },
          reduce()
            ? { duration: 0 }
            : { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
        ),
      );
    }

    if (line) {
      const length = line.getTotalLength?.() ?? 0;
      line.style.strokeDasharray = `${length}`;
      line.style.strokeDashoffset = reduce() ? "0" : `${length}`;
      if (!reduce()) {
        controls.push(
          animate(
            line,
            { strokeDashoffset: [length, 0], opacity: [0.4, 1] },
            { duration: 0.9, ease: [0.33, 0, 0.2, 1] },
          ),
        );
      } else {
        line.style.opacity = "1";
      }
    }
  }

  if (inView) {
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        run();
        observer?.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(host);
  } else {
    run();
  }

  return {
    element: host,
    destroy() {
      observer?.disconnect();
      machine.stop();
      controls.forEach((control) => control.stop?.());
      root.innerHTML = "";
    },
  };
}

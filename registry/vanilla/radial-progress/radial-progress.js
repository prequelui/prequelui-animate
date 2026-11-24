const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function formatNumber(value) {
  const rounded = Math.round(value);
  return String(rounded).replace(/\B(?=(\d{3})+$)/g, ",");
}

function springNumber(initial, options) {
  const { stiffness = 90, damping = 50, mass = 1 } = options ?? {};
  let value = initial;
  let velocity = 0;
  let target = initial;
  let frame = null;
  let last = 0;
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
      return;
    }
    frame = requestAnimationFrame(tick);
  }

  return {
    get value() {
      return value;
    },
    setTarget(next) {
      target = next;
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
      emit();
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

let uid = 0;

export function createRadialProgress(root, options = {}) {
  const {
    value = 0,
    size = 148,
    strokeWidth = 10,
    from = 0,
    label,
    showLabel = true,
    showTicks = true,
    ticks = 48,
    inView = true,
    color = "currentColor",
    trackColor = "currentColor",
    className = "",
  } = options;
  const safe = clamp(value, 0, 100);
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const tickCount = Math.max(4, Math.round(ticks));
  const id = ++uid;
  const fontSize = Math.max(22, Math.round(size * 0.25));

  const tickMarkup = showTicks
    ? Array.from({ length: tickCount }, (_, index) => {
        const angle = (index / tickCount) * 360;
        const major = index % 6 === 0;
        const active = (index / tickCount) * 100 <= safe;
        const inner = radius + strokeWidth / 2 + 4;
        const outer = inner + (major ? 5 : 2.5);
        return `<line x1="${center}" y1="${center - inner}" x2="${center}" y2="${center - outer}"
          stroke="${color}" stroke-opacity="${active ? 0.5 : 0.14}" stroke-width="${major ? 1.4 : 1}"
          stroke-linecap="round" transform="rotate(${angle} ${center} ${center})" />`;
      }).join("")
    : "";

  root.innerHTML = `
    <div data-slot="radial-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100"
      aria-valuenow="${Math.round(safe)}" aria-label="${label ?? "Progress"}"
      class="relative inline-flex items-center justify-center ${className}"
      style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id="radial-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.55" />
            <stop offset="100%" stop-color="${color}" stop-opacity="1" />
          </linearGradient>
        </defs>
        <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="${trackColor}"
          stroke-opacity="0.12" stroke-width="${strokeWidth}" stroke-linecap="round" />
        <circle data-arc cx="${center}" cy="${center}" r="${radius}" fill="none"
          stroke="url(#radial-${id})" stroke-width="${strokeWidth}" stroke-linecap="round"
          stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" />
        ${tickMarkup}
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
        <span data-count class="font-medium leading-none tracking-[-0.04em] tabular-nums"
          style="font-size:${fontSize}px">${formatNumber(from)}</span>
        ${showLabel ? `<span class="text-[13px] leading-4 text-muted-foreground">${label ?? "complete"}</span>` : ""}
      </div>
    </div>`;

  const host = root.querySelector("[data-slot]");
  const arc = root.querySelector("[data-arc]");
  const countEl = root.querySelector("[data-count]");
  const progress = springNumber(0, {});
  const counter = springNumber(from, {});
  let observer;
  let started = false;

  progress.subscribe((latest) => {
    arc.style.strokeDashoffset = `${circumference * (1 - latest / 100)}`;
  });
  counter.subscribe((latest) => {
    countEl.textContent = formatNumber(latest);
  });

  function run() {
    if (started) return;
    started = true;
    if (reduce()) {
      progress.jump(safe);
      counter.jump(safe);
      return;
    }
    progress.setTarget(safe);
    counter.setTarget(safe);
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
      progress.stop();
      counter.stop();
      root.innerHTML = "";
    },
  };
}

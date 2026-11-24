const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function formatNumber(value, options) {
  const { decimals, decimalSeparator, thousandSeparator, padLength } = options;
  const fixed = Math.abs(value).toFixed(decimals);
  const sign = value < 0 && Number(fixed) !== 0 ? "-" : "";
  const [integer = "0", fraction] = fixed.split(".");
  const padded = integer.padStart(padLength, "0");
  const grouped =
    thousandSeparator === undefined
      ? padded
      : padded.replace(/\B(?=(\d{3})+$)/g, thousandSeparator);
  return fraction
    ? `${sign}${grouped}${decimalSeparator}${fraction}`
    : `${sign}${grouped}`;
}

function springNumber(initial, options) {
  const {
    stiffness = 90,
    damping = 50,
    mass = 1,
    restDelta = 0.001,
    restSpeed = 0.01,
  } = options ?? {};
  let value = initial;
  let velocity = 0;
  let target = initial;
  let frame = null;
  let last = 0;
  let restCallbacks = [];
  const listeners = new Set();

  function emit() {
    listeners.forEach((listener) => listener(value));
  }

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
    if (Math.abs(velocity) < restSpeed && Math.abs(value - target) < restDelta) {
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

  function start() {
    if (frame === null) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  }

  return {
    get value() {
      return value;
    },
    setTarget(next, onRest) {
      target = next;
      if (onRest) restCallbacks.push(onRest);
      start();
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
      return () => listeners.delete(listener);
    },
    stop() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      last = 0;
    },
  };
}

export function createCountingNumber(root, options = {}) {
  const {
    number = 0,
    fromNumber = 0,
    padStart = false,
    decimalPlaces = 0,
    decimalSeparator = ".",
    thousandSeparator,
    inView = false,
    inViewOnce = true,
    delay = 0,
    initiallyStable = false,
    transition,
    onCompleted,
    className = "",
  } = options;
  const format = {
    decimals: decimalPlaces,
    decimalSeparator,
    thousandSeparator,
    padLength: padStart ? Math.floor(Math.abs(number)).toString().length : 0,
  };

  root.innerHTML = `
    <span data-slot="counting-number" class="inline-block tabular-nums ${className}">
      <span data-visual aria-hidden="true"></span>
      <span class="sr-only">${formatNumber(number, format)}</span>
    </span>`;
  const host = root.querySelector("[data-slot]");
  const visual = root.querySelector("[data-visual]");
  const machine = springNumber(initiallyStable ? number : fromNumber, transition ?? {});
  let timer;
  let observer;
  let seen = !inView;
  let running = false;

  visual.textContent = formatNumber(machine.value, format);
  machine.subscribe((latest) => {
    visual.textContent = formatNumber(latest, format);
  });

  function complete() {
    onCompleted?.();
  }

  function play() {
    if (running) return;
    running = true;
    if (reduce()) {
      machine.jump(number);
      complete();
      return;
    }
    timer = setTimeout(() => {
      machine.setTarget(number, complete);
    }, delay);
  }

  if (inView) {
    observer = new IntersectionObserver(
      (entries) => {
        seen = entries.some((entry) => entry.isIntersecting);
        if (seen) {
          play();
          if (inViewOnce) observer?.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(host);
  } else {
    play();
  }

  return {
    element: host,
    destroy() {
      clearTimeout(timer);
      observer?.disconnect();
      machine.stop();
      root.innerHTML = "";
    },
  };
}

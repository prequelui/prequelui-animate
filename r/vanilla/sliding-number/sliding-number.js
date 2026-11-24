const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function digitAt(units, place) {
  return Math.floor(Math.abs(units) / place) % 10;
}

function formatNumber(value, options) {
  const { decimals, decimalSeparator, thousandSeparator, padLength } = options;
  const fixed = Math.abs(value).toFixed(decimals);
  const sign = value < 0 && Number(fixed) !== 0 ? "-" : "";
  const [integer = "0", fraction] = fixed.split(".");
  let int = integer.padStart(padLength, "0");
  if (thousandSeparator !== undefined) {
    int = int.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  }
  return fraction
    ? `${sign}${int}${decimalSeparator}${fraction}`
    : `${sign}${int}`;
}

function springNumber(initial, options) {
  const {
    stiffness = 200,
    damping = 20,
    mass = 0.4,
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

function createRoller(place, initialDigit, options, reduce) {
  const span = document.createElement("span");
  span.dataset.slot = "sliding-number-roller";
  span.className =
    "relative inline-block w-[1ch] overflow-y-clip leading-none tabular-nums";
  span.dataset.place = String(place);
  span.innerHTML = `<span class="invisible">0</span>${Array.from(
    { length: 10 },
    (_, digit) =>
      `<span data-digit="${digit}" aria-hidden="true" class="absolute inset-0 flex items-center justify-center">${digit}</span>`,
  ).join("")}`;

  const digits = Array.from(span.querySelectorAll("[data-digit]"));
  const position = springNumber(initialDigit, options);

  function paint(latest) {
    const current = ((latest % 10) + 10) % 10;
    for (const node of digits) {
      const digit = Number(node.dataset.digit);
      let offset = (10 + digit - current) % 10;
      if (offset > 5) offset -= 10;
      node.style.transform = `translateY(${offset * 100}%)`;
    }
  }

  position.subscribe(paint);
  paint(initialDigit);

  return {
    element: span,
    place,
    position,
    setDigit(digit) {
      if (reduce()) position.jump(digit);
      else position.setTarget(digit);
    },
  };
}

export function createSlidingNumber(root, options = {}) {
  const {
    number = 0,
    fromNumber,
    padStart = false,
    decimalPlaces = 0,
    decimalSeparator = ".",
    thousandSeparator,
    inView = false,
    inViewOnce = true,
    delay = 0,
    initiallyStable = false,
    transition,
    onNumberChange,
    onCompleted,
    className = "",
  } = options;
  const counting = fromNumber !== undefined;
  const factor = Math.pow(10, decimalPlaces);
  const toUnits = (value) => Math.round(value * factor);
  const initial = initiallyStable ? number : fromNumber ?? 0;

  root.innerHTML = `
    <span data-slot="sliding-number" class="inline-flex items-center tabular-nums ${className}">
      <span data-label class="sr-only"></span>
      <span data-sign aria-hidden="true" class="mr-1"></span>
      <span data-digits aria-hidden="true" class="inline-flex items-center"></span>
    </span>`;
  const host = root.querySelector("[data-slot]");
  const label = root.querySelector("[data-label]");
  const signEl = root.querySelector("[data-sign]");
  const digitsEl = root.querySelector("[data-digits]");

  let value = initial;
  let units = toUnits(initial);
  let layout = {
    length: Math.max(1, Math.floor(Math.abs(units) / factor).toString().length),
    negative: units < 0,
  };
  const rollerOptions = transition ?? {
    stiffness: 200,
    damping: 20,
    mass: 0.4,
    restDelta: 0.001,
    restSpeed: 0.01,
  };
  let rollers = [];
  let observer;
  let timer;
  let started = false;
  let machine;

  function layoutKey() {
    return `${layout.length}:${layout.negative ? 1 : 0}`;
  }

  function build() {
    const shownLength = padStart
      ? Math.max(Math.floor(Math.abs(number)).toString().length, layout.length)
      : layout.length;
    const format = {
      decimals: decimalPlaces,
      decimalSeparator,
      thousandSeparator,
      padLength: padStart ? shownLength : 0,
    };
    label.textContent = formatNumber(number, format);
    signEl.textContent = layout.negative ? "-" : "";

    rollers.forEach((roller) => roller.position.stop());
    digitsEl.innerHTML = "";
    rollers = [];
    const intPlaces = Array.from({ length: Math.max(1, shownLength) }, (_, index) =>
      Math.pow(10, shownLength - index - 1) * factor,
    );

    intPlaces.forEach((place, index) => {
      const right = intPlaces.length - index - 1;
      const roller = createRoller(place, digitAt(units, place), rollerOptions, reduce);
      digitsEl.appendChild(roller.element);
      rollers.push(roller);
      if (thousandSeparator !== undefined && right > 0 && right % 3 === 0) {
        const separator = document.createElement("span");
        separator.setAttribute("aria-hidden", "true");
        separator.textContent = thousandSeparator;
        digitsEl.appendChild(separator);
      }
    });

    if (decimalPlaces > 0) {
      const decimal = document.createElement("span");
      decimal.setAttribute("aria-hidden", "true");
      decimal.textContent = decimalSeparator;
      digitsEl.appendChild(decimal);
      const decimalList = Array.from({ length: decimalPlaces }, (_, index) =>
        Math.pow(10, decimalPlaces - index - 1),
      );
      for (const place of decimalList) {
        const roller = createRoller(place, digitAt(units, place), rollerOptions, reduce);
        digitsEl.appendChild(roller.element);
        rollers.push(roller);
      }
    }
    host.dataset.layout = layoutKey();
  }

  function applyUnits(next) {
    units = next;
    const length = Math.max(
      1,
      Math.floor(Math.abs(units) / factor).toString().length,
    );
    const negative = units < 0;
    if (length !== layout.length || negative !== layout.negative) {
      layout = { length, negative };
      build();
    }
    for (const roller of rollers) {
      roller.setDigit(digitAt(units, roller.place));
    }
    onNumberChange?.(units / factor);
  }

  function startCounting() {
    machine = springNumber(initial, { stiffness: 90, damping: 50, mass: 1 });
    machine.subscribe((latest) => {
      value = latest;
      applyUnits(toUnits(latest));
    });
    if (reduce()) {
      machine.jump(number);
      onCompleted?.();
      return;
    }
    timer = setTimeout(() => {
      machine.setTarget(number, () => onCompleted?.());
    }, delay);
  }

  build();

  function run() {
    if (started) return;
    started = true;
    if (counting) {
      startCounting();
      return;
    }
    if (initiallyStable) {
      onCompleted?.();
      return;
    }
    if (reduce()) {
      value = number;
      units = toUnits(number);
      layout = {
        length: Math.max(
          1,
          Math.floor(Math.abs(units) / factor).toString().length,
        ),
        negative: units < 0,
      };
      build();
      onCompleted?.();
      return;
    }
    timer = setTimeout(() => {
      value = number;
      applyUnits(toUnits(number));
      onCompleted?.();
    }, delay);
  }

  if (inView) {
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        run();
        if (inViewOnce) observer?.disconnect();
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
      clearTimeout(timer);
      observer?.disconnect();
      machine?.stop();
      rollers.forEach((roller) => roller.position.stop());
      root.innerHTML = "";
    },
  };
}

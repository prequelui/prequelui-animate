import { animate } from "motion";

const crossDirections = [
  { dx: 1, dy: 0, rotate: 0 },
  { dx: -1, dy: 0, rotate: 0 },
  { dx: 0, dy: -1, rotate: 90 },
  { dx: 0, dy: 1, rotate: 90 },
];

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ringGeometry = (item) => {
  const end = Math.max(item.size / 1.5, 50);
  return { end, start: Math.max(end * 0.2, 12), stroke: Math.max(end * 0.05, 2.5) };
};

const crossGeometry = (item) => {
  const distance = Math.max(item.size * 0.65, 56);
  const gap = Math.max(item.size * 0.05, 3);
  const lengthStart = Math.max(item.size * 0.26, 16);
  const lengthEnd = Math.max(lengthStart * 0.55, 6);
  const strokeWidth = Math.max(item.size * 0.065, 2);
  const half = distance + gap + lengthStart;
  return { distance, gap, lengthStart, lengthEnd, strokeWidth, half };
};

const burstGeometry = (item) => {
  const start = Math.max(item.size * 0.4, 36);
  const end = Math.max(item.size * 0.65, 56);
  const lengthStart = Math.max(item.size * 0.2, 14);
  const lengthEnd = Math.max(lengthStart * 0.5, 6);
  const strokeWidth = Math.max(item.size * 0.05, 1.5);
  const half = end + lengthStart;
  return { start, end, lengthStart, lengthEnd, strokeWidth, half };
};

const particleGeometry = (item) => {
  const dot = Math.max(item.size * 0.025, 2.5);
  const radius = item.size * 0.35;
  return { dot, radius, half: radius + dot * 2 };
};

function rootStyle(item) {
  const base = "position:fixed;overflow:visible;";
  if (item.variant === "ripple") {
    return `${base}left:${item.x - item.size / 2}px;top:${item.y - item.size / 2}px;width:${item.size}px;height:${item.size}px;`;
  }
  if (item.variant === "ring") {
    const ring = ringGeometry(item);
    return `${base}left:${item.x - ring.end / 2}px;top:${item.y - ring.end / 2}px;width:${ring.end}px;height:${ring.end}px;`;
  }
  if (item.variant === "crosshair") {
    const cross = crossGeometry(item);
    return `${base}left:${item.x - cross.half}px;top:${item.y - cross.half}px;width:${cross.half * 2}px;height:${cross.half * 2}px;transform:rotate(-25deg);`;
  }
  if (item.variant === "burst") {
    const burst = burstGeometry(item);
    return `${base}left:${item.x - burst.half}px;top:${item.y - burst.half}px;width:${burst.half * 2}px;height:${burst.half * 2}px;`;
  }
  const particle = particleGeometry(item);
  return `${base}left:${item.x - particle.half}px;top:${item.y - particle.half}px;width:${particle.half * 2}px;height:${particle.half * 2}px;`;
}

function ringPartStyle(item) {
  const ring = ringGeometry(item);
  return `width:100%;height:100%;border-radius:9999px;border-style:solid;border-color:${item.color};border-width:${ring.stroke}px;transform:scale(${ring.start / ring.end});`;
}

function crossPartStyle(item) {
  const cross = crossGeometry(item);
  return `position:absolute;left:50%;top:50%;width:${cross.lengthStart}px;height:${cross.strokeWidth}px;margin-left:${-cross.lengthStart / 2}px;margin-top:${-cross.strokeWidth / 2}px;background:${item.color};border-radius:9999px;`;
}

function burstPartStyle(item) {
  const burst = burstGeometry(item);
  return `position:absolute;left:50%;top:50%;width:${burst.lengthStart}px;height:${burst.strokeWidth}px;margin-left:${-burst.lengthStart / 2}px;margin-top:${-burst.strokeWidth / 2}px;background:${item.color};border-radius:9999px;`;
}

function particlePartStyle(item) {
  const particle = particleGeometry(item);
  return `position:absolute;left:50%;top:50%;width:${particle.dot}px;height:${particle.dot}px;margin-left:${-particle.dot / 2}px;margin-top:${-particle.dot / 2}px;border-radius:9999px;background:${item.color};opacity:0;`;
}

export function createClick(root, options = {}) {
  const {
    content = "",
    variant = "ring",
    color = "currentColor",
    size = 100,
    duration = 400,
    disabled = false,
    scope = null,
    className = "",
  } = options;
  const timers = new Set();
  let controls = [];
  let nextId = 0;
  let destroyed = false;

  root.innerHTML = `<span data-slot="click" style="display:contents" class="${className}">${content}</span>`;
  const host = root.querySelector("[data-slot]");
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:9999;";
  document.body.appendChild(layer);

  let target = document;
  if (scope) {
    const node = typeof scope === "string" ? document.querySelector(scope) : scope;
    if (node) target = node;
  }

  function animateItem(item) {
    const node = layer.querySelector(`[data-click-id="${item.id}"]`);
    if (!node) return;
    const parts = Array.from(node.querySelectorAll("[data-part]"));
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
        const direction = crossDirections[index] ?? crossDirections[0];
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
  }

  function add(event) {
    if (destroyed || (options.disabled ?? disabled) || reduce()) return;
    if (target !== document) {
      const rect = target.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        return;
      }
    }

    const item = {
      id: nextId,
      x: event.clientX,
      y: event.clientY,
      variant: options.variant ?? variant,
      color: options.color ?? color,
      size: options.size ?? size,
      duration: options.duration ?? duration,
    };
    nextId += 1;

    const node = document.createElement("div");
    node.dataset.clickId = String(item.id);
    node.setAttribute("style", rootStyle(item));
    if (item.variant === "ripple") {
      node.innerHTML = `<span data-part style="display:block;width:100%;height:100%;border-radius:9999px;background:${item.color};box-shadow:inset 0 0 0 2px ${item.color}"></span>`;
    } else if (item.variant === "ring") {
      node.innerHTML = `<span data-part style="${ringPartStyle(item)}"></span>`;
    } else if (item.variant === "crosshair") {
      node.innerHTML = crossDirections
        .map(() => `<span data-part style="${crossPartStyle(item)}"></span>`)
        .join("");
    } else if (item.variant === "burst") {
      node.innerHTML = Array.from(
        { length: 8 },
        () => `<span data-part style="${burstPartStyle(item)}"></span>`,
      ).join("");
    } else {
      node.innerHTML = Array.from(
        { length: 8 },
        () => `<span data-part style="${particlePartStyle(item)}"></span>`,
      ).join("");
    }
    layer.appendChild(node);

    queueMicrotask(() => animateItem(item));

    const timer = setTimeout(() => {
      timers.delete(timer);
      node.remove();
    }, item.duration + 320);
    timers.add(timer);
  }

  target.addEventListener("pointerup", add, { passive: true });

  return {
    element: host,
    destroy() {
      destroyed = true;
      target.removeEventListener("pointerup", add);
      for (const timer of timers) clearTimeout(timer);
      timers.clear();
      for (const control of controls) control?.stop?.();
      controls = [];
      layer.remove();
      root.innerHTML = "";
    },
  };
}

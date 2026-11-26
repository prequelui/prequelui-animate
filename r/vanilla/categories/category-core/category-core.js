const BASE = { x: 0, y: 0, rotate: 0, scale: 1 };
const PICTURE_EASE = "cubic-bezier(0.34, 1.3, 0.64, 1)";
const ART_SCALE = 1.32;
const ART_TRANSFORM = `translate(512 512) scale(${ART_SCALE}) translate(-512 -512)`;
const INK_STROKE = 23;
const STROKE_BOOST = 1.12;

let categoryUid = 0;

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function targetOf(base, motion) {
  return { ...base, ...(motion ?? {}) };
}

function transformOf(target) {
  return `translate3d(${target.x ?? 0}px, ${target.y ?? 0}px, 0) rotate(${target.rotate ?? 0}deg) scale(${target.scale ?? 1})`;
}

function widthOf(part) {
  return ((part.width ?? INK_STROKE) * STROKE_BOOST) / ART_SCALE;
}

function gradientStop(definition, index) {
  const start = index === 0 ? definition.palette.light[0] : definition.palette.light[1];
  const end = index === 0 ? definition.palette.dark[0] : definition.palette.dark[1];
  return escapeXml(`light-dark(${start}, ${end})`);
}

function accentPath(part, gradientId) {
  return `<path d="${escapeXml(part.d)}"${
    part.transform ? ` transform="${escapeXml(part.transform)}"` : ""
  } fill="url(#${gradientId})"${
    part.opacity !== undefined ? ` opacity="${part.opacity}"` : ""
  }/>`;
}

function inkPath(part) {
  const transform = part.transform ? ` transform="${escapeXml(part.transform)}"` : "";
  if (part.fill) {
    return `<path d="${escapeXml(part.d)}"${transform} fill="currentColor" fill-rule="evenodd"${
      part.opacity !== undefined ? ` opacity="${part.opacity}"` : ""
    }/>`;
  }
  return `<path d="${escapeXml(part.d)}"${transform} fill="none" stroke="currentColor" stroke-width="${widthOf(
    part,
  )}" stroke-linecap="round" stroke-linejoin="round"${
    part.opacity !== undefined ? ` opacity="${part.opacity}"` : ""
  }/>`;
}

function svgMarkup(definition, size, gradientId, interactive) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024" fill="none" style="color-scheme: light dark" data-category-pictogram="${escapeXml(
    definition.slug,
  )}" data-category-motion="${escapeXml(definition.motion)}"${
    interactive ? "" : ' aria-hidden="true"'
  }><defs><linearGradient id="${gradientId}" x1="0" y1="1" x2="1" y2="0"><stop stop-color="${gradientStop(
    definition,
    0,
  )}"/><stop offset="1" stop-color="${gradientStop(
    definition,
    1,
  )}"/></linearGradient></defs><g transform="${ART_TRANSFORM}"><g data-category-accents="" fill="url(#${gradientId})">${definition.accent
    .map((part) => accentPath(part, gradientId))
    .join("")}</g><g data-category-ink="">${definition.ink
    .map(inkPath)
    .join("")}</g></g></svg>`;
}

export function buildCategorySvg(definition, size = 40) {
  return svgMarkup(definition, size, `cat-${definition.slug}`, false);
}

export function createCategoryPictogram(root, definition, options = {}) {
  const state = {
    definition,
    size: options.size ?? 40,
    active: options.active,
    animateOnHover: options.animateOnHover !== false,
    label: options.label ?? "",
    className: options.className ?? "",
  };
  const gradientId = `cat-${definition.slug}-${categoryUid++}`;
  let hovered = false;
  let reduce = false;
  let media = null;

  function render() {
    const { definition: current, size, label, className } = state;
    const accessibility = label
      ? ` role="img" aria-label="${escapeXml(label)}"`
      : ' aria-hidden="true"';
    root.innerHTML = `<span data-category-pictogram-host="" class="inline-flex shrink-0 items-center justify-center${className ? ` ${className}` : ""}"${
      state.active && state.animateOnHover ? ' data-active="true"' : ""
    }>${svgMarkup(
      current,
      size,
      gradientId,
      true,
    ).replace("<svg ", `<svg${accessibility} `)}</span>`;
  }

  function apply() {
    const host = root.querySelector("[data-category-pictogram-host]");
    if (!host) return;
    if (state.active && state.animateOnHover) host.setAttribute("data-active", "true");
    else host.removeAttribute("data-active");
    const isActive =
      !!state.animateOnHover &&
      !reduce &&
      (state.active === undefined ? hovered : state.active);
    const main = host.querySelector("[data-category-ink]");
    const accent = host.querySelector("[data-category-accents]");
    const transition = reduce ? "none" : `transform 520ms ${PICTURE_EASE}`;
    const mainTarget = targetOf(
      BASE,
      isActive ? state.definition.motionConfig.main : undefined,
    );
    const accentTarget = targetOf(
      BASE,
      isActive ? state.definition.motionConfig.accent : undefined,
    );
    for (const [node, target] of [
      [main, mainTarget],
      [accent, accentTarget],
    ]) {
      if (!node) continue;
      node.style.transform = transformOf(target);
      node.style.transition = transition;
      node.style.transformBox = "fill-box";
      node.style.transformOrigin = "center";
    }
  }

  function enter() {
    if (state.animateOnHover) {
      hovered = true;
      apply();
    }
  }

  function leave() {
    hovered = false;
    apply();
  }

  function onChange() {
    reduce = media ? media.matches : false;
    apply();
  }

  render();
  apply();
  root.addEventListener("pointerenter", enter);
  root.addEventListener("pointerleave", leave);
  if (typeof window !== "undefined" && window.matchMedia) {
    media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduce = media.matches;
    media.addEventListener?.("change", onChange);
    apply();
  }

  return {
    element: root.querySelector("[data-category-pictogram-host]"),
    get definition() {
      return state.definition;
    },
    update(next = {}) {
      const rebuild =
        next.definition !== undefined ||
        next.size !== undefined ||
        next.label !== undefined ||
        next.className !== undefined;
      Object.assign(state, next);
      if (next.animateOnHover !== undefined) {
        state.animateOnHover = next.animateOnHover !== false;
      }
      if (rebuild) render();
      apply();
    },
    play() {
      hovered = true;
      apply();
    },
    reset() {
      hovered = false;
      apply();
    },
    destroy() {
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointerleave", leave);
      media?.removeEventListener?.("change", onChange);
      root.innerHTML = "";
    },
  };
}

// @ts-nocheck
import { createSignal, For, onCleanup, onMount } from "solid-js";

const BASE = { x: 0, y: 0, rotate: 0, scale: 1 };
const PICTURE_EASE = "cubic-bezier(0.34, 1.3, 0.64, 1)";
const ART_SCALE = 1.32;
const ART_TRANSFORM = `translate(512 512) scale(${ART_SCALE}) translate(-512 -512)`;
const INK_STROKE = 23;
const STROKE_BOOST = 1.12;

let categoryUid = 0;

function targetOf(base, motion) {
  return { ...base, ...(motion ?? {}) };
}

function transformOf(target) {
  return `translate3d(${target.x ?? 0}px, ${target.y ?? 0}px, 0) rotate(${target.rotate ?? 0}deg) scale(${target.scale ?? 1})`;
}

function styleOf(target, reduce) {
  return `transform:${transformOf(target)};transition:${
    reduce ? "none" : `transform 520ms ${PICTURE_EASE}`
  };transform-box:fill-box;transform-origin:center`;
}

function gradientStop(definition, index) {
  const start = index === 0 ? definition.palette.light[0] : definition.palette.light[1];
  const end = index === 0 ? definition.palette.dark[0] : definition.palette.dark[1];
  return `light-dark(${start}, ${end})`;
}

export function CategoryPictogram(props) {
  const gradientId = `cat-${props.definition.slug}-${categoryUid++}`;
  const [hovered, setHovered] = createSignal(false);
  const [reduce, setReduce] = createSignal(false);

  onMount(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(media.matches);
    const onChange = () => setReduce(media.matches);
    media.addEventListener?.("change", onChange);
    onCleanup(() => media.removeEventListener?.("change", onChange));
  });

  const isActive = () =>
    props.animateOnHover !== false &&
    !reduce() &&
    (props.active === undefined ? hovered() : props.active);

  const mainTarget = () =>
    targetOf(BASE, isActive() ? props.definition.motionConfig.main : undefined);
  const accentTarget = () =>
    targetOf(BASE, isActive() ? props.definition.motionConfig.accent : undefined);

  const enter = (event) => {
    props.onPointerEnter?.(event);
    if (props.animateOnHover !== false) setHovered(true);
  };
  const leave = (event) => {
    props.onPointerLeave?.(event);
    setHovered(false);
  };

  return (
    <span
      data-category-pictogram-host=""
      data-active={props.active && props.animateOnHover !== false ? "true" : undefined}
      class={`inline-flex shrink-0 items-center justify-center ${props.class ?? props.className ?? ""}`}
      onPointerEnter={enter}
      onPointerLeave={leave}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.size ?? 40}
        height={props.size ?? 40}
        viewBox="0 0 1024 1024"
        fill="none"
        data-category-pictogram={props.definition.slug}
        data-category-motion={props.definition.motion}
        role={props.label ? "img" : undefined}
        aria-label={props.label || undefined}
        aria-hidden={props.label ? undefined : true}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            <stop stop-color={gradientStop(props.definition, 0)} />
            <stop offset="1" stop-color={gradientStop(props.definition, 1)} />
          </linearGradient>
        </defs>
        <g transform={ART_TRANSFORM}>
          <g
            data-category-accents=""
            fill={`url(#${gradientId})`}
            style={styleOf(accentTarget(), reduce())}
          >
            <For each={props.definition.accent}>
              {(part) => (
                <path
                  d={part.d}
                  transform={part.transform}
                  opacity={part.opacity}
                />
              )}
            </For>
          </g>
          <g data-category-ink="" style={styleOf(mainTarget(), reduce())}>
            <For each={props.definition.ink}>
              {(part) =>
                part.fill ? (
                  <path
                    d={part.d}
                    transform={part.transform}
                    fill="currentColor"
                    fill-rule="evenodd"
                    opacity={part.opacity}
                  />
                ) : (
                  <path
                    d={part.d}
                    transform={part.transform}
                    fill="none"
                    stroke="currentColor"
                    stroke-width={((part.width ?? INK_STROKE) * STROKE_BOOST) / ART_SCALE}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    opacity={part.opacity}
                  />
                )
              }
            </For>
          </g>
        </g>
      </svg>
    </span>
  );
}

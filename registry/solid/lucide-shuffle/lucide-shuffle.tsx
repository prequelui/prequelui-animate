// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "shuffle",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "sway",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m18 14 4 4-4 4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m18 2 4 4-4 4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 6h1.972a4 4 0 0 1 3.6 2.2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"
      }
    }
  ],
  "accents": [
    0,
    1,
    3,
    4
  ]
};

export function LucideShuffleIcon(props) {
  let host;

  const view = () =>
    renderSetIcon(definition, {
      size: props.size ?? 28,
      className: props.class ?? "",
      label: props.label ?? "",
    });

  onMount(() => {
    const controller = bindSetIcon(host, definition, () => ({
      speed: props.speed ?? 1,
      delay: props.delay ?? 0,
      loop: props.loop ?? false,
      animate: props.animate ?? false,
      animateOnHover: props.animateOnHover ?? true,
      animateOnTap: props.animateOnTap ?? true,
      animateOnView: props.animateOnView ?? false,
      animateOnViewOnce: props.animateOnViewOnce ?? true,
      animation: props.animation ?? "hover",
    }));
    onCleanup(() => controller.destroy());
  });

  return (
    <span
      ref={host}
      data-slot="prequel-set-icon-host"
      style={{ display: "contents" }}
      innerHTML={view()}
    />
  );
}

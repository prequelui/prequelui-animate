// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "arrows-shuffle",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "sway",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M18 4l3 3l-3 3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18 20l3 -3l-3 -3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 7h-5a4.978 4.978 0 0 0 -3 1m-4 8a4.984 4.984 0 0 1 -3 1h-3"
      }
    }
  ],
  "accents": [
    0,
    1,
    2
  ]
};

export function TablerArrowsShuffleIcon(props) {
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

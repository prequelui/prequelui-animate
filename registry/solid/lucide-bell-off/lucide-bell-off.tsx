// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "bell-off",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "ring",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10.268 21a2 2 0 0 0 3.464 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m2 2 20 20"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05"
      }
    }
  ],
  "accents": [
    0
  ]
};

export function LucideBellOffIcon(props) {
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

// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "sun",
  "category": "Status",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "sun",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 2v2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 20v2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m4.93 4.93 1.41 1.41"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m17.66 17.66 1.41 1.41"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 12h2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M20 12h2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m6.34 17.66-1.41 1.41"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m19.07 4.93-1.41 1.41"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "12",
        "cy": "12",
        "r": "4"
      }
    }
  ],
  "accents": [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7
  ]
};

export function LucideSunIcon(props) {
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

// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "sliders-horizontal",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10 5H3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 19H3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M14 3v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 17v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 12h-9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 19h-5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 5h-7"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 10v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 12H3"
      }
    }
  ],
  "accents": [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8
  ]
};

export function LucideSlidersHorizontalIcon(props) {
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

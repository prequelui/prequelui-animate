// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "list",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "pop",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 5h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 12h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 19h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 5h13"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 12h13"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 19h13"
      }
    }
  ],
  "accents": [
    1,
    2,
    3,
    4,
    5
  ]
};

export function LucideListIcon(props) {
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

// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "calendar",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "flip",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M8 2v3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 2v3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 9h18"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "x": "3",
        "y": "3",
        "width": "18",
        "height": "18",
        "rx": "2"
      }
    }
  ],
  "accents": [
    0,
    1,
    2
  ]
};

export function LucideCalendarIcon(props) {
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

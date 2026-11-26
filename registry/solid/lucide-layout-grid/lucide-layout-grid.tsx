// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "layout-grid",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "pop",
  "parts": [
    {
      "tag": "rect",
      "attrs": {
        "width": "7",
        "height": "7",
        "x": "3",
        "y": "3",
        "rx": "1"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "7",
        "height": "7",
        "x": "14",
        "y": "3",
        "rx": "1"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "7",
        "height": "7",
        "x": "14",
        "y": "14",
        "rx": "1"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "7",
        "height": "7",
        "x": "3",
        "y": "14",
        "rx": "1"
      }
    }
  ],
  "accents": [
    1,
    2,
    3
  ]
};

export function LucideLayoutGridIcon(props) {
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

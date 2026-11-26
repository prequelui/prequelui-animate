// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "percent",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "coin",
  "parts": [
    {
      "tag": "circle",
      "attrs": {
        "cx": "6.5",
        "cy": "6.5",
        "r": "2.5"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "17.5",
        "cy": "17.5",
        "r": "2.5"
      }
    },
    {
      "tag": "line",
      "attrs": {
        "x1": "19",
        "x2": "5",
        "y1": "5",
        "y2": "19"
      }
    }
  ],
  "accents": []
};

export function LucidePercentIcon(props) {
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

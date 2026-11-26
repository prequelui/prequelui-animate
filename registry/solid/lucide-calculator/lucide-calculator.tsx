// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "calculator",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M16 10h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 10h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 10h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 14h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 14h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 18h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 18h.01"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "16",
        "height": "20",
        "x": "4",
        "y": "2",
        "rx": "2"
      }
    },
    {
      "tag": "line",
      "attrs": {
        "x1": "8",
        "x2": "16",
        "y1": "6",
        "y2": "6"
      }
    },
    {
      "tag": "line",
      "attrs": {
        "x1": "16",
        "x2": "16",
        "y1": "14",
        "y2": "18"
      }
    }
  ],
  "accents": []
};

export function LucideCalculatorIcon(props) {
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

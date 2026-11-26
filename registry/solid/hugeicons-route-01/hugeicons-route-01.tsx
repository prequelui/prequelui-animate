// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "route-01",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "orbit",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 5H8.5C6.567 5 5 6.567 5 8.5C5 10.433 6.567 12 8.5 12H15.5C17.433 12 19 13.567 19 15.5C19 17.433 17.433 19 15.5 19H12"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "18",
        "cy": "5",
        "r": "3"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "6",
        "cy": "19",
        "r": "3"
      }
    }
  ],
  "accents": [
    0,
    2
  ]
};

export function HugeiconsRoute01Icon(props) {
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

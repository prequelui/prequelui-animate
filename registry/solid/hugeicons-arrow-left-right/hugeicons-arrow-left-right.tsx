// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "arrow-left-right",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideLeft",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M19.9999 17L3.99994 17"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 14C17 14 19.9999 16.2095 19.9999 17C19.9999 17.7906 16.9999 20 16.9999 20"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4.99994 7L19.9999 7"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6.99992 4C6.99992 4 3.99995 6.20947 3.99994 7.00002C3.99993 7.79058 6.99994 10 6.99994 10"
      }
    }
  ],
  "accents": [
    0
  ]
};

export function HugeiconsArrowLeftRightIcon(props) {
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

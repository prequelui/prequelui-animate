// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "basket",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5.001 8h13.999a2 2 0 0 1 1.977 2.304l-1.255 7.152a3 3 0 0 1 -2.966 2.544h-9.512a3 3 0 0 1 -2.965 -2.544l-1.255 -7.152a2 2 0 0 1 1.977 -2.304"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 10l-2 -6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7 10l2 -6"
      }
    }
  ],
  "accents": []
};

export function TablerBasketIcon(props) {
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

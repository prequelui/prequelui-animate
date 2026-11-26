// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "sliders-horizontal",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3.99963 5.00055L9.99963 5.00031"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12.9996 5.00031L19.9996 5.00031"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15.9996 9.00031L15.9996 15.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9.99963 2.00031L9.99963 8.00031"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11.9996 16.0003L11.9996 22.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15.9996 12.0001L19.9996 12.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3.99963 12.0005L12.9996 12.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11.9996 19.0003L19.9996 19.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3.99963 19.0005L8.99963 19.0003"
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
    7,
    8
  ]
};

export function HugeiconsSlidersHorizontalIcon(props) {
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

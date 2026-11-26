// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "sliders-vertical",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M5.00018 20.0001L4.99994 14.0001"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4.99994 11.0001V4.00006"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8.99994 8.00006H14.9999"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M1.99994 14.0001H7.99994"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15.9999 12.0001H21.9999"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11.9997 8.00006L11.9999 4.00006"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12.0002 20.0001L11.9999 11.0001"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18.9999 12.0001L18.9999 4.00006"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19.0002 20.0001L18.9999 15.0001"
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

export function HugeiconsSlidersVerticalIcon(props) {
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

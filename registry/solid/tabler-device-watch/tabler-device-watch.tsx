// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "device-watch",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "clock",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6 9a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3v-6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 18v3h6v-3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 6v-3h6v3"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export function TablerDeviceWatchIcon(props) {
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

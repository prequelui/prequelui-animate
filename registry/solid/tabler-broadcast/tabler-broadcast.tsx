// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "broadcast",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "signal",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M18.364 19.364a9 9 0 1 0 -12.728 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15.536 16.536a5 5 0 1 0 -7.072 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11 13a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export function TablerBroadcastIcon(props) {
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

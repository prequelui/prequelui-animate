// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "scan-face",
  "category": "Status",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "shake",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 7V5a2 2 0 0 1 2-2h2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 3h2a2 2 0 0 1 2 2v2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 17v2a2 2 0 0 1-2 2h-2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7 21H5a2 2 0 0 1-2-2v-2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 14s1.5 2 4 2 4-2 4-2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 9h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 9h.01"
      }
    }
  ],
  "accents": [
    1,
    2,
    3,
    4,
    5,
    6
  ]
};

export function LucideScanFaceIcon(props) {
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

// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "trash",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "trash",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10 11v6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M14 11v6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 6h18"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      }
    }
  ],
  "accents": [
    0,
    1,
    3,
    4
  ]
};

export function LucideTrashIcon(props) {
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

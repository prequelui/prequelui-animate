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
        "d": "M4 7l16 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10 11l0 6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M14 11l0 6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"
      }
    }
  ],
  "accents": [
    0,
    1,
    2,
    4
  ]
};

export function TablerTrashIcon(props) {
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

// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "notebook",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M2 6h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 10h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 14h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 18h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 2v20"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "16",
        "height": "20",
        "x": "4",
        "y": "2",
        "rx": "2"
      }
    }
  ],
  "accents": [
    0,
    1,
    2,
    3,
    4
  ]
};

export function LucideNotebookIcon(props) {
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

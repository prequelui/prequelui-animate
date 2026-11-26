// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "notebook",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10 11H13.5M10 7H17"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M13 2H12.5C8.72877 2 6.84314 2 5.67157 3.17158C4.5 4.34315 4.5 6.22877 4.5 10V14C4.5 17.7712 4.5 19.6569 5.67157 20.8284C6.84315 22 8.72876 22 12.5 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V10C21 6.22877 21 4.34315 19.8284 3.17157C18.6569 2 16.7712 2 13 2Z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 6H3M6 12H3M6 18H3"
      }
    }
  ],
  "accents": [
    0,
    2
  ]
};

export function HugeiconsNotebookIcon(props) {
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

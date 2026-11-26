// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "presentation",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "grow",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M2 3h20"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m7 21 5-5 5 5"
      }
    }
  ],
  "accents": [
    0,
    2
  ]
};

export function LucidePresentationIcon(props) {
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

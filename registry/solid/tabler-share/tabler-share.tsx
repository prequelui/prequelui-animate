// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "share",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "orbit",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8.7 10.7l6.6 -3.4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8.7 13.3l6.6 3.4"
      }
    }
  ],
  "accents": [
    1,
    2,
    3,
    4
  ]
};

export function TablerShareIcon(props) {
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

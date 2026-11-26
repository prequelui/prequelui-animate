// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "mail-opened",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "mail",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 9l9 6l9 -6l-9 -6l-9 6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 9v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 19l6 -6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 13l6 6"
      }
    }
  ],
  "accents": [
    0,
    2,
    3
  ]
};

export function TablerMailOpenedIcon(props) {
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

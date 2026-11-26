// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "moon",
  "category": "Status",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "moon",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 22C15.3137 22 18 17.5228 18 12C18 6.47715 15.3137 2 12 2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10 14.5C10 15.3284 9.32843 16 8.5 16C7.67157 16 7 15.3284 7 14.5C7 13.6716 7.67157 13 8.5 13C9.32843 13 10 13.6716 10 14.5Z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11.125 7H11M11.25 7C11.25 7.13807 11.1381 7.25 11 7.25C10.8619 7.25 10.75 7.13807 10.75 7C10.75 6.86193 10.8619 6.75 11 6.75C11.1381 6.75 11.25 6.86193 11.25 7Z"
      }
    }
  ],
  "accents": [
    1,
    2,
    3
  ]
};

export function HugeiconsMoonIcon(props) {
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

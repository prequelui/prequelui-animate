// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "database",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M7 10.842C7.60158 11.0229 8.27434 11.1718 9 11.282"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M20 12C20 13.6569 16.4183 15 12 15C7.58172 15 4 13.6569 4 12"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7 17.842C7.60158 18.0229 8.27434 18.1718 9 18.282"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M20 5V19C20 20.6569 16.4183 22 12 22C7.58172 22 4 20.6569 4 19V5"
      }
    },
    {
      "tag": "ellipse",
      "attrs": {
        "cx": "12",
        "cy": "5",
        "rx": "8",
        "ry": "3"
      }
    }
  ],
  "accents": [
    0,
    1,
    2,
    3
  ]
};

export function HugeiconsDatabaseIcon(props) {
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

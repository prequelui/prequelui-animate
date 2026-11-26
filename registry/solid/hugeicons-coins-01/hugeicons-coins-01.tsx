// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "coins-01",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M22 15.5C22 16.6046 19.0899 17.5 15.5 17.5C11.9101 17.5 9 16.6046 9 15.5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M22 11V19.8C22 21.015 19.0899 22 15.5 22C11.9101 22 9 21.015 9 19.8V11"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 11C4.10819 10.7698 2.36991 10.1745 2 9M6 16C4.10819 15.7698 2.36991 15.1745 2 14"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 21C4.10819 20.7698 2.36991 20.1745 2 19L2 4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 6V4"
      }
    },
    {
      "tag": "ellipse",
      "attrs": {
        "cx": "15.5",
        "cy": "11",
        "rx": "6.5",
        "ry": "2"
      }
    },
    {
      "tag": "ellipse",
      "attrs": {
        "cx": "8.5",
        "cy": "4",
        "rx": "6.5",
        "ry": "2"
      }
    }
  ],
  "accents": []
};

export function HugeiconsCoins01Icon(props) {
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

// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "rss",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "signal",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M19.5 19.5C19.5 11.2157 12.7843 4.5 4.5 4.5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12.5 19.5C12.5 15.0817 8.91828 11.5 4.5 11.5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5.25 19H5M5.5 19C5.5 19.2761 5.27614 19.5 5 19.5C4.72386 19.5 4.5 19.2761 4.5 19C4.5 18.7239 4.72386 18.5 5 18.5C5.27614 18.5 5.5 18.7239 5.5 19Z"
      }
    }
  ],
  "accents": [
    0,
    1
  ]
};

export function HugeiconsRssIcon(props) {
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

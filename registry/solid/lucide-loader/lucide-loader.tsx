// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "loader",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "spin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 2v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m16.2 7.8 2.9-2.9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18 12h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m16.2 16.2 2.9 2.9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 18v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m4.9 19.1 2.9-2.9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 12h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m4.9 4.9 2.9 2.9"
      }
    }
  ],
  "accents": []
};

export function LucideLoaderIcon(props) {
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

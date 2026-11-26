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
        "d": "M12 6l0 -3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16.25 7.75l2.15 -2.15"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18 12l3 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16.25 16.25l2.15 2.15"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 18l0 3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7.75 16.25l-2.15 2.15"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 12l-3 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7.75 7.75l-2.15 -2.15"
      }
    }
  ],
  "accents": []
};

export function TablerLoaderIcon(props) {
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

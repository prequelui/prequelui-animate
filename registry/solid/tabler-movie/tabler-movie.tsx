// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "movie",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 4l0 16"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 4l0 16"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 8l4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 16l4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 12l16 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 8l4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 16l4 0"
      }
    }
  ],
  "accents": []
};

export function TablerMovieIcon(props) {
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

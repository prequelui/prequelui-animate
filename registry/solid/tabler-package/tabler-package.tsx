// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "package",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "float",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 12l8 -4.5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 12l0 9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 12l-8 -4.5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 5.25l-8 4.5"
      }
    }
  ],
  "accents": []
};

export function TablerPackageIcon(props) {
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

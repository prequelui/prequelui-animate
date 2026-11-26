// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "arrow-fat-down",
  "category": "Navigation",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "slideDown",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M231.39,132.94A8,8,0,0,0,224,128H184V48a16,16,0,0,0-16-16H88A16,16,0,0,0,72,48v80H32a8,8,0,0,0-5.66,13.66l96,96a8,8,0,0,0,11.32,0l96-96A8,8,0,0,0,231.39,132.94ZM128,220.69,51.31,144H80a8,8,0,0,0,8-8V48h80v88a8,8,0,0,0,8,8h28.69Z"
      }
    }
  ],
  "accents": []
};

export function PhosphorArrowFatDownIcon(props) {
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

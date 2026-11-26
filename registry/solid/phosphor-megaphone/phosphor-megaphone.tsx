// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "megaphone",
  "category": "Communication",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "shake",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M248,120a48.05,48.05,0,0,0-48-48H160.2c-2.91-.17-53.62-3.74-101.91-44.24A16,16,0,0,0,32,40V200a16,16,0,0,0,26.29,12.25c37.77-31.68,77-40.76,93.71-43.3v31.72A16,16,0,0,0,159.12,214l11,7.33A16,16,0,0,0,194.5,212l11.77-44.36A48.07,48.07,0,0,0,248,120ZM48,199.93V40h0c42.81,35.91,86.63,45,104,47.24v65.48C134.65,155,90.84,164.07,48,199.93Zm131,8,0,.11-11-7.33V168h21.6ZM200,152H168V88h32a32,32,0,1,1,0,64Z"
      }
    }
  ],
  "accents": []
};

export function PhosphorMegaphoneIcon(props) {
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

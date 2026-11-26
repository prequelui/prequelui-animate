// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindSetIcon, renderSetIcon } from "../icon-set-core";

const definition = {
  "name": "stop",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "press",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 12C4 8.72077 4 7.08116 4.81382 5.91891C5.1149 5.48891 5.48891 5.1149 5.91891 4.81382C7.08116 4 8.72077 4 12 4C15.2792 4 16.9188 4 18.0811 4.81382C18.5111 5.1149 18.8851 5.48891 19.1862 5.91891C20 7.08116 20 8.72077 20 12C20 15.2792 20 16.9188 19.1862 18.0811C18.8851 18.5111 18.5111 18.8851 18.0811 19.1862C16.9188 20 15.2792 20 12 20C8.72077 20 7.08116 20 5.91891 19.1862C5.48891 18.8851 5.1149 18.5111 4.81382 18.0811C4 16.9188 4 15.2792 4 12Z"
      }
    }
  ],
  "accents": []
};

export function HugeiconsStopIcon(props) {
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

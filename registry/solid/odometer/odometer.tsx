// @ts-nocheck
import { createEffect, onCleanup, onMount } from "solid-js";
import { createOdometer } from "./odometer.js";

export function Odometer(props) {
  let host;
  let instance;

  onMount(() => {
    instance = createOdometer(host, {
      className: props.className ?? "",
      preview: props.preview ?? false,
    });
    const extra = String(props.className || "").split(/\s+/).filter(Boolean);
    if (extra.length) host.classList.add(...extra);
  });

  createEffect(() => {
    const next = props.preview ?? false;
    instance?.update({ preview: next });
  });
  onCleanup(() => instance?.destroy());

  return <div ref={host} />;
}

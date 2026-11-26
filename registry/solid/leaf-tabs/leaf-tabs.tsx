// @ts-nocheck
import { createEffect, onCleanup, onMount } from "solid-js";
import { createLeafTabs } from "./leaf-tabs.js";

export function LeafTabs(props) {
  let host;
  let instance;

  onMount(() => {
    instance = createLeafTabs(host, {
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

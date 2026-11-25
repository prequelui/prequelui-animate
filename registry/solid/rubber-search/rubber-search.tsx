// @ts-nocheck
import { createEffect, onCleanup, onMount } from "solid-js";
import { createRubberSearch } from "./rubber-search.js";

export function RubberSearch(props) {
  let host;
  let instance;

  onMount(() => {
    instance = createRubberSearch(host, {
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

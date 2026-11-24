import { onCleanup, onMount } from "solid-js";
import { mountPrequelBot } from "@prequelui/bot";
import type { BotConfig, PrequelBotHandle } from "../types";

export type PrequelBotProps = Partial<BotConfig> & {
  disabled?: boolean;
};

export function PrequelBot(props: PrequelBotProps) {
  let handle: PrequelBotHandle | null = null;
  onMount(() => {
    if (props.disabled) return;
    const env = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env;
    if (env && env.DEV === false) return;
    handle = mountPrequelBot(document.body, { ...props, framework: props.framework ?? "solid" });
  });
  onCleanup(() => {
    handle?.destroy();
    handle = null;
  });
  return null;
}

export default PrequelBot;

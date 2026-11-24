import { mountPrequelBot } from "@prequelui/bot";
import type { BotConfig, PrequelBotHandle } from "../types";

export type PrequelBotParams = Partial<BotConfig>;

export function prequelBot(node: HTMLElement, params: PrequelBotParams = {}) {
  let handle: PrequelBotHandle | null = null;
  const start = (options: PrequelBotParams) => {
    handle?.destroy();
    handle = mountPrequelBot(document.body, { ...options, framework: options.framework ?? "svelte" });
  };
  start(params);
  void node;
  return {
    update(next: PrequelBotParams) {
      start(next);
    },
    destroy() {
      handle?.destroy();
      handle = null;
    },
  };
}

export const PrequelBot = prequelBot;
export default PrequelBot;

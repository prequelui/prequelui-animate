import { createPrequelBotIcon } from "./prequel-bot.js";

export function createPrequelBotSolidIcon(root, options = {}) {
  const controller = createPrequelBotIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

import { createPrequelBotIcon } from "./prequel-bot.js";

export function createPrequelBotColorIcon(root, options = {}) {
  const controller = createPrequelBotIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

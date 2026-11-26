import { createPrequelBotIcon } from "./prequel-bot.js";

export function createPrequelBotDuotoneIcon(root, options = {}) {
  const controller = createPrequelBotIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

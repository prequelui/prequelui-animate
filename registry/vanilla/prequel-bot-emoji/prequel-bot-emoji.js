import { createPrequelBotIcon } from "./prequel-bot.js";

export function createPrequelBotEmojiIcon(root, options = {}) {
  const controller = createPrequelBotIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

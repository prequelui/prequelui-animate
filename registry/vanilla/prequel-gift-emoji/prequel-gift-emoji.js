import { createPrequelGiftIcon } from "./prequel-gift.js";

export function createPrequelGiftEmojiIcon(root, options = {}) {
  const controller = createPrequelGiftIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

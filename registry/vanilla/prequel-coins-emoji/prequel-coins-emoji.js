import { createPrequelCoinsIcon } from "./prequel-coins.js";

export function createPrequelCoinsEmojiIcon(root, options = {}) {
  const controller = createPrequelCoinsIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

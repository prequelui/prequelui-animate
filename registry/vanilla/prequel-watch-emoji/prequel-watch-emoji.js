import { createPrequelWatchIcon } from "./prequel-watch.js";

export function createPrequelWatchEmojiIcon(root, options = {}) {
  const controller = createPrequelWatchIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

import { createPrequelTrendingDownIcon } from "./prequel-trending-down.js";

export function createPrequelTrendingDownEmojiIcon(root, options = {}) {
  const controller = createPrequelTrendingDownIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

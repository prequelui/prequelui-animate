import { createPrequelTrendingUpIcon } from "./prequel-trending-up.js";

export function createPrequelTrendingUpEmojiIcon(root, options = {}) {
  const controller = createPrequelTrendingUpIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

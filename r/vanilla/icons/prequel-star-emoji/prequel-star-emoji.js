import { createPrequelStarIcon } from "./prequel-star.js";

export function createPrequelStarEmojiIcon(root, options = {}) {
  const controller = createPrequelStarIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

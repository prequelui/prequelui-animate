import { createPrequelHeartIcon } from "./prequel-heart.js";

export function createPrequelHeartEmojiIcon(root, options = {}) {
  const controller = createPrequelHeartIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

import { createPrequelHeadphonesIcon } from "./prequel-headphones.js";

export function createPrequelHeadphonesEmojiIcon(root, options = {}) {
  const controller = createPrequelHeadphonesIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

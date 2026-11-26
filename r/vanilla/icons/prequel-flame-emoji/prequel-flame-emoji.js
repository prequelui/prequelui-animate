import { createPrequelFlameIcon } from "./prequel-flame.js";

export function createPrequelFlameEmojiIcon(root, options = {}) {
  const controller = createPrequelFlameIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

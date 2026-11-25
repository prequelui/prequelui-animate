import { createPrequelSafeIcon } from "./prequel-safe.js";

export function createPrequelSafeEmojiIcon(root, options = {}) {
  const controller = createPrequelSafeIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

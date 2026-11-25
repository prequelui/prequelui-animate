import { createPrequelSyringeIcon } from "./prequel-syringe.js";

export function createPrequelSyringeEmojiIcon(root, options = {}) {
  const controller = createPrequelSyringeIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

import { createPrequelSunIcon } from "./prequel-sun.js";

export function createPrequelSunEmojiIcon(root, options = {}) {
  const controller = createPrequelSunIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

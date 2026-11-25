import { createPrequelTagIcon } from "./prequel-tag.js";

export function createPrequelTagEmojiIcon(root, options = {}) {
  const controller = createPrequelTagIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

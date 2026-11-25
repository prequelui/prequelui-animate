import { createPrequelTrashIcon } from "./prequel-trash.js";

export function createPrequelTrashEmojiIcon(root, options = {}) {
  const controller = createPrequelTrashIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

import { createPrequelFilePlusIcon } from "./prequel-file-plus.js";

export function createPrequelFilePlusEmojiIcon(root, options = {}) {
  const controller = createPrequelFilePlusIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

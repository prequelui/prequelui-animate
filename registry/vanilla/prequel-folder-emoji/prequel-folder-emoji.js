import { createPrequelFolderIcon } from "./prequel-folder.js";

export function createPrequelFolderEmojiIcon(root, options = {}) {
  const controller = createPrequelFolderIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

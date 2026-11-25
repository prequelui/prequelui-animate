import { createPrequelFolderOpenIcon } from "./prequel-folder-open.js";

export function createPrequelFolderOpenEmojiIcon(root, options = {}) {
  const controller = createPrequelFolderOpenIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

import { createPrequelFileIcon } from "./prequel-file.js";

export function createPrequelFileEmojiIcon(root, options = {}) {
  const controller = createPrequelFileIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

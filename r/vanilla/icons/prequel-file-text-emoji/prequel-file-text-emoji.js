import { createPrequelFileTextIcon } from "./prequel-file-text.js";

export function createPrequelFileTextEmojiIcon(root, options = {}) {
  const controller = createPrequelFileTextIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

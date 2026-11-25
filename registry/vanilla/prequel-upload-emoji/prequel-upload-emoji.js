import { createPrequelUploadIcon } from "./prequel-upload.js";

export function createPrequelUploadEmojiIcon(root, options = {}) {
  const controller = createPrequelUploadIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

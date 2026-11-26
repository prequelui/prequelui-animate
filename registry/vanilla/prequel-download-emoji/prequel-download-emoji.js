import { createPrequelDownloadIcon } from "./prequel-download.js";

export function createPrequelDownloadEmojiIcon(root, options = {}) {
  const controller = createPrequelDownloadIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

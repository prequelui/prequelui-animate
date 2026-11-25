import { createPrequelArchiveIcon } from "./prequel-archive.js";

export function createPrequelArchiveEmojiIcon(root, options = {}) {
  const controller = createPrequelArchiveIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

import { createPrequelSearchIcon } from "./prequel-search.js";

export function createPrequelSearchEmojiIcon(root, options = {}) {
  const controller = createPrequelSearchIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

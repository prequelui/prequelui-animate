import { createPrequelArrowUpIcon } from "./prequel-arrow-up.js";

export function createPrequelArrowUpEmojiIcon(root, options = {}) {
  const controller = createPrequelArrowUpIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

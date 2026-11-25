import { createPrequelArrowUpRightIcon } from "./prequel-arrow-up-right.js";

export function createPrequelArrowUpRightEmojiIcon(root, options = {}) {
  const controller = createPrequelArrowUpRightIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

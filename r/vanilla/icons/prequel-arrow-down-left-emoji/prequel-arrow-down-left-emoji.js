import { createPrequelArrowDownLeftIcon } from "./prequel-arrow-down-left.js";

export function createPrequelArrowDownLeftEmojiIcon(root, options = {}) {
  const controller = createPrequelArrowDownLeftIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

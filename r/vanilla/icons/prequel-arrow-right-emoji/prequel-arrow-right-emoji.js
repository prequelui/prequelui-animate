import { createPrequelArrowRightIcon } from "./prequel-arrow-right.js";

export function createPrequelArrowRightEmojiIcon(root, options = {}) {
  const controller = createPrequelArrowRightIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

import { createPrequelArrowLeftIcon } from "./prequel-arrow-left.js";

export function createPrequelArrowLeftEmojiIcon(root, options = {}) {
  const controller = createPrequelArrowLeftIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

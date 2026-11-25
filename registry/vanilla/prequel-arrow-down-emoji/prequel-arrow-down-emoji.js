import { createPrequelArrowDownIcon } from "./prequel-arrow-down.js";

export function createPrequelArrowDownEmojiIcon(root, options = {}) {
  const controller = createPrequelArrowDownIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

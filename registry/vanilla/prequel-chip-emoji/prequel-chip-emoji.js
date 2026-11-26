import { createPrequelChipIcon } from "./prequel-chip.js";

export function createPrequelChipEmojiIcon(root, options = {}) {
  const controller = createPrequelChipIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

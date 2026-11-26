import { createPrequelBanknoteIcon } from "./prequel-banknote.js";

export function createPrequelBanknoteEmojiIcon(root, options = {}) {
  const controller = createPrequelBanknoteIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

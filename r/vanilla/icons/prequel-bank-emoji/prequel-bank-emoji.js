import { createPrequelBankIcon } from "./prequel-bank.js";

export function createPrequelBankEmojiIcon(root, options = {}) {
  const controller = createPrequelBankIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

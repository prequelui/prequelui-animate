import { createPrequelPiggyBankIcon } from "./prequel-piggy-bank.js";

export function createPrequelPiggyBankEmojiIcon(root, options = {}) {
  const controller = createPrequelPiggyBankIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

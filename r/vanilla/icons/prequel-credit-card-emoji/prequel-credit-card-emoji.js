import { createPrequelCreditCardIcon } from "./prequel-credit-card.js";

export function createPrequelCreditCardEmojiIcon(root, options = {}) {
  const controller = createPrequelCreditCardIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

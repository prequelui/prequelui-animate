import { createPrequelBasketIcon } from "./prequel-basket.js";

export function createPrequelBasketEmojiIcon(root, options = {}) {
  const controller = createPrequelBasketIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

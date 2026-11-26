import { createPrequelShoppingCartIcon } from "./prequel-cart.js";

export function createPrequelShoppingCartEmojiIcon(root, options = {}) {
  const controller = createPrequelShoppingCartIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

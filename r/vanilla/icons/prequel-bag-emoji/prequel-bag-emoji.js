import { createPrequelShoppingBagIcon } from "./prequel-bag.js";

export function createPrequelShoppingBagEmojiIcon(root, options = {}) {
  const controller = createPrequelShoppingBagIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

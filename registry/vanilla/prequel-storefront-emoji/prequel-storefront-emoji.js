import { createPrequelStorefrontIcon } from "./prequel-storefront.js";

export function createPrequelStorefrontEmojiIcon(root, options = {}) {
  const controller = createPrequelStorefrontIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

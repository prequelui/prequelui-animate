import { createPrequelGiftIcon } from "./prequel-gift.js";

export function createPrequelGiftColorIcon(root, options = {}) {
  const controller = createPrequelGiftIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

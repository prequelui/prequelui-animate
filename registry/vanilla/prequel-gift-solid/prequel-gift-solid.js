import { createPrequelGiftIcon } from "./prequel-gift.js";

export function createPrequelGiftSolidIcon(root, options = {}) {
  const controller = createPrequelGiftIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

import { createPrequelGiftIcon } from "./prequel-gift.js";

export function createPrequelGiftDuotoneIcon(root, options = {}) {
  const controller = createPrequelGiftIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

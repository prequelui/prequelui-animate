import { createPrequelBasketIcon } from "./prequel-basket.js";

export function createPrequelBasketDuotoneIcon(root, options = {}) {
  const controller = createPrequelBasketIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

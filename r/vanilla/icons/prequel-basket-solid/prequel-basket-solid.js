import { createPrequelBasketIcon } from "./prequel-basket.js";

export function createPrequelBasketSolidIcon(root, options = {}) {
  const controller = createPrequelBasketIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

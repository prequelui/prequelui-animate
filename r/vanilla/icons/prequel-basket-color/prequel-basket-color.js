import { createPrequelBasketIcon } from "./prequel-basket.js";

export function createPrequelBasketColorIcon(root, options = {}) {
  const controller = createPrequelBasketIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

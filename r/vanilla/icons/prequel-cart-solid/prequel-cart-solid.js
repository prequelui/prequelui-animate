import { createPrequelShoppingCartIcon } from "./prequel-cart.js";

export function createPrequelShoppingCartSolidIcon(root, options = {}) {
  const controller = createPrequelShoppingCartIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

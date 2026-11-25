import { createPrequelShoppingCartIcon } from "./prequel-cart.js";

export function createPrequelShoppingCartColorIcon(root, options = {}) {
  const controller = createPrequelShoppingCartIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

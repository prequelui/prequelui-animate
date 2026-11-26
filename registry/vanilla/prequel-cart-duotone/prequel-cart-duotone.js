import { createPrequelShoppingCartIcon } from "./prequel-cart.js";

export function createPrequelShoppingCartDuotoneIcon(root, options = {}) {
  const controller = createPrequelShoppingCartIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

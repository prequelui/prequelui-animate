import { createPrequelShoppingBagIcon } from "./prequel-bag.js";

export function createPrequelShoppingBagDuotoneIcon(root, options = {}) {
  const controller = createPrequelShoppingBagIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

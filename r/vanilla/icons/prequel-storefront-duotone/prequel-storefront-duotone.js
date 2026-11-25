import { createPrequelStorefrontIcon } from "./prequel-storefront.js";

export function createPrequelStorefrontDuotoneIcon(root, options = {}) {
  const controller = createPrequelStorefrontIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

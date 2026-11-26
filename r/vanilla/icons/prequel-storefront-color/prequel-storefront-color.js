import { createPrequelStorefrontIcon } from "./prequel-storefront.js";

export function createPrequelStorefrontColorIcon(root, options = {}) {
  const controller = createPrequelStorefrontIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

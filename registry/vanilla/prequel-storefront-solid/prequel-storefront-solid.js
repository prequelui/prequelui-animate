import { createPrequelStorefrontIcon } from "./prequel-storefront.js";

export function createPrequelStorefrontSolidIcon(root, options = {}) {
  const controller = createPrequelStorefrontIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

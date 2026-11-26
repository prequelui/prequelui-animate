import { createPrequelSmartphoneIcon } from "./prequel-smartphone.js";

export function createPrequelSmartphoneDuotoneIcon(root, options = {}) {
  const controller = createPrequelSmartphoneIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

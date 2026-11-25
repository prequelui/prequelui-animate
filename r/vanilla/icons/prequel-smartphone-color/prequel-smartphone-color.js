import { createPrequelSmartphoneIcon } from "./prequel-smartphone.js";

export function createPrequelSmartphoneColorIcon(root, options = {}) {
  const controller = createPrequelSmartphoneIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

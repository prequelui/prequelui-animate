import { createPrequelSmartphoneIcon } from "./prequel-smartphone.js";

export function createPrequelSmartphoneSolidIcon(root, options = {}) {
  const controller = createPrequelSmartphoneIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

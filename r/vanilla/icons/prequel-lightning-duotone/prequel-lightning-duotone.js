import { createPrequelLightningIcon } from "./prequel-lightning.js";

export function createPrequelLightningDuotoneIcon(root, options = {}) {
  const controller = createPrequelLightningIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

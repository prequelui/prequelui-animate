import { createPrequelLightningIcon } from "./prequel-lightning.js";

export function createPrequelLightningSolidIcon(root, options = {}) {
  const controller = createPrequelLightningIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

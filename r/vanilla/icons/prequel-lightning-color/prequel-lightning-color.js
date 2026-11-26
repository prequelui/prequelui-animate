import { createPrequelLightningIcon } from "./prequel-lightning.js";

export function createPrequelLightningColorIcon(root, options = {}) {
  const controller = createPrequelLightningIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

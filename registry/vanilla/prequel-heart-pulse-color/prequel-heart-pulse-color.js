import { createPrequelHeartPulseIcon } from "./prequel-heart-pulse.js";

export function createPrequelHeartPulseColorIcon(root, options = {}) {
  const controller = createPrequelHeartPulseIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

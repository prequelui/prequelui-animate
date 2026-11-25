import { createPrequelHeartPulseIcon } from "./prequel-heart-pulse.js";

export function createPrequelHeartPulseDuotoneIcon(root, options = {}) {
  const controller = createPrequelHeartPulseIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

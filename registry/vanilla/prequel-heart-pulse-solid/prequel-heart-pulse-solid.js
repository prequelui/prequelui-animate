import { createPrequelHeartPulseIcon } from "./prequel-heart-pulse.js";

export function createPrequelHeartPulseSolidIcon(root, options = {}) {
  const controller = createPrequelHeartPulseIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

import { createPrequelTimerIcon } from "./prequel-timer.js";

export function createPrequelTimerDuotoneIcon(root, options = {}) {
  const controller = createPrequelTimerIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

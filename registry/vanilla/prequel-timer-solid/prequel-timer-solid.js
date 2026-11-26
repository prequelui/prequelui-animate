import { createPrequelTimerIcon } from "./prequel-timer.js";

export function createPrequelTimerSolidIcon(root, options = {}) {
  const controller = createPrequelTimerIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

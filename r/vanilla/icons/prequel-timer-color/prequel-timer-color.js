import { createPrequelTimerIcon } from "./prequel-timer.js";

export function createPrequelTimerColorIcon(root, options = {}) {
  const controller = createPrequelTimerIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

import { createPrequelClockIcon } from "./prequel-clock.js";

export function createPrequelClockColorIcon(root, options = {}) {
  const controller = createPrequelClockIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

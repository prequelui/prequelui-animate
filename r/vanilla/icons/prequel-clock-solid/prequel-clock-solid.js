import { createPrequelClockIcon } from "./prequel-clock.js";

export function createPrequelClockSolidIcon(root, options = {}) {
  const controller = createPrequelClockIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

import { createPrequelClockIcon } from "./prequel-clock.js";

export function createPrequelClockDuotoneIcon(root, options = {}) {
  const controller = createPrequelClockIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

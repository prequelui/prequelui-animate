import { createPrequelActivityIcon } from "./prequel-activity.js";

export function createPrequelActivityDuotoneIcon(root, options = {}) {
  const controller = createPrequelActivityIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

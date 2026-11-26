import { createPrequelActivityIcon } from "./prequel-activity.js";

export function createPrequelActivitySolidIcon(root, options = {}) {
  const controller = createPrequelActivityIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

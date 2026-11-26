import { createPrequelActivityIcon } from "./prequel-activity.js";

export function createPrequelActivityColorIcon(root, options = {}) {
  const controller = createPrequelActivityIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

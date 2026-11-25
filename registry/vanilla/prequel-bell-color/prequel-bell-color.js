import { createPrequelBellIcon } from "./prequel-bell.js";

export function createPrequelBellColorIcon(root, options = {}) {
  const controller = createPrequelBellIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

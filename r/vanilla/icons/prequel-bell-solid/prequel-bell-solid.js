import { createPrequelBellIcon } from "./prequel-bell.js";

export function createPrequelBellSolidIcon(root, options = {}) {
  const controller = createPrequelBellIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

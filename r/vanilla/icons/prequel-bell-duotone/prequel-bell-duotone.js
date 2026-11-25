import { createPrequelBellIcon } from "./prequel-bell.js";

export function createPrequelBellDuotoneIcon(root, options = {}) {
  const controller = createPrequelBellIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

import { createPrequelLockIcon } from "./prequel-lock.js";

export function createPrequelLockSolidIcon(root, options = {}) {
  const controller = createPrequelLockIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

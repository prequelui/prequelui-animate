import { createPrequelLockIcon } from "./prequel-lock.js";

export function createPrequelLockDuotoneIcon(root, options = {}) {
  const controller = createPrequelLockIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

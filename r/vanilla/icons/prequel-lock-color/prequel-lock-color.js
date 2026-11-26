import { createPrequelLockIcon } from "./prequel-lock.js";

export function createPrequelLockColorIcon(root, options = {}) {
  const controller = createPrequelLockIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

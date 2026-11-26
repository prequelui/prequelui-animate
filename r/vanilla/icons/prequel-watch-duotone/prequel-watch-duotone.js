import { createPrequelWatchIcon } from "./prequel-watch.js";

export function createPrequelWatchDuotoneIcon(root, options = {}) {
  const controller = createPrequelWatchIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

import { createPrequelWatchIcon } from "./prequel-watch.js";

export function createPrequelWatchSolidIcon(root, options = {}) {
  const controller = createPrequelWatchIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

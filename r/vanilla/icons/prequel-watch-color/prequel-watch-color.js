import { createPrequelWatchIcon } from "./prequel-watch.js";

export function createPrequelWatchColorIcon(root, options = {}) {
  const controller = createPrequelWatchIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

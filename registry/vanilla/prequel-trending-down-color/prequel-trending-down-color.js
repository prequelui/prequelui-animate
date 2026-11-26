import { createPrequelTrendingDownIcon } from "./prequel-trending-down.js";

export function createPrequelTrendingDownColorIcon(root, options = {}) {
  const controller = createPrequelTrendingDownIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

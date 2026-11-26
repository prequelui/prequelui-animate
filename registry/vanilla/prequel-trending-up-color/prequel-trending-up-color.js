import { createPrequelTrendingUpIcon } from "./prequel-trending-up.js";

export function createPrequelTrendingUpColorIcon(root, options = {}) {
  const controller = createPrequelTrendingUpIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

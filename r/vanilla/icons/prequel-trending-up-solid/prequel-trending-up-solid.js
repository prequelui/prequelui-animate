import { createPrequelTrendingUpIcon } from "./prequel-trending-up.js";

export function createPrequelTrendingUpSolidIcon(root, options = {}) {
  const controller = createPrequelTrendingUpIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

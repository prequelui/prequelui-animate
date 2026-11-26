import { createPrequelTrendingDownIcon } from "./prequel-trending-down.js";

export function createPrequelTrendingDownSolidIcon(root, options = {}) {
  const controller = createPrequelTrendingDownIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

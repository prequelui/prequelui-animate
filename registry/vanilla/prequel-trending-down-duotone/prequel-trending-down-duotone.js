import { createPrequelTrendingDownIcon } from "./prequel-trending-down.js";

export function createPrequelTrendingDownDuotoneIcon(root, options = {}) {
  const controller = createPrequelTrendingDownIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

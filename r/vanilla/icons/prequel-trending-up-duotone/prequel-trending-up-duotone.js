import { createPrequelTrendingUpIcon } from "./prequel-trending-up.js";

export function createPrequelTrendingUpDuotoneIcon(root, options = {}) {
  const controller = createPrequelTrendingUpIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

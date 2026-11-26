import { createPrequelStarIcon } from "./prequel-star.js";

export function createPrequelStarDuotoneIcon(root, options = {}) {
  const controller = createPrequelStarIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

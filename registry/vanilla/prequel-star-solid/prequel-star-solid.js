import { createPrequelStarIcon } from "./prequel-star.js";

export function createPrequelStarSolidIcon(root, options = {}) {
  const controller = createPrequelStarIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

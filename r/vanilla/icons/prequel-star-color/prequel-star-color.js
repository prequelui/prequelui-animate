import { createPrequelStarIcon } from "./prequel-star.js";

export function createPrequelStarColorIcon(root, options = {}) {
  const controller = createPrequelStarIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

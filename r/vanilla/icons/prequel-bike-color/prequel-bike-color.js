import { createPrequelBikeIcon } from "./prequel-bike.js";

export function createPrequelBikeColorIcon(root, options = {}) {
  const controller = createPrequelBikeIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

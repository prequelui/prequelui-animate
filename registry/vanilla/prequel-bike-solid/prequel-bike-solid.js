import { createPrequelBikeIcon } from "./prequel-bike.js";

export function createPrequelBikeSolidIcon(root, options = {}) {
  const controller = createPrequelBikeIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

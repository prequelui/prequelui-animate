import { createPrequelBikeIcon } from "./prequel-bike.js";

export function createPrequelBikeDuotoneIcon(root, options = {}) {
  const controller = createPrequelBikeIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

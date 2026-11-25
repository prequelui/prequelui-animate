import { createPrequelTrainIcon } from "./prequel-train.js";

export function createPrequelTrainDuotoneIcon(root, options = {}) {
  const controller = createPrequelTrainIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

import { createPrequelTrainIcon } from "./prequel-train.js";

export function createPrequelTrainColorIcon(root, options = {}) {
  const controller = createPrequelTrainIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

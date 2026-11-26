import { createPrequelTrainIcon } from "./prequel-train.js";

export function createPrequelTrainSolidIcon(root, options = {}) {
  const controller = createPrequelTrainIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

import { createPrequelScaleIcon } from "./prequel-scale.js";

export function createPrequelScaleColorIcon(root, options = {}) {
  const controller = createPrequelScaleIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

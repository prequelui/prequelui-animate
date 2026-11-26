import { createPrequelScaleIcon } from "./prequel-scale.js";

export function createPrequelScaleSolidIcon(root, options = {}) {
  const controller = createPrequelScaleIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

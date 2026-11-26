import { createPrequelScaleIcon } from "./prequel-scale.js";

export function createPrequelScaleDuotoneIcon(root, options = {}) {
  const controller = createPrequelScaleIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

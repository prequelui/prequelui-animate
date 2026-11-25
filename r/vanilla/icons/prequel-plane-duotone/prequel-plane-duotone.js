import { createPrequelPlaneIcon } from "./prequel-plane.js";

export function createPrequelPlaneDuotoneIcon(root, options = {}) {
  const controller = createPrequelPlaneIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

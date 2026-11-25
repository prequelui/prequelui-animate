import { createPrequelPlaneIcon } from "./prequel-plane.js";

export function createPrequelPlaneSolidIcon(root, options = {}) {
  const controller = createPrequelPlaneIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

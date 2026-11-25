import { createPrequelCompassIcon } from "./prequel-compass.js";

export function createPrequelCompassDuotoneIcon(root, options = {}) {
  const controller = createPrequelCompassIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

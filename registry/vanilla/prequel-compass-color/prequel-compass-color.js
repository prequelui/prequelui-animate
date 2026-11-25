import { createPrequelCompassIcon } from "./prequel-compass.js";

export function createPrequelCompassColorIcon(root, options = {}) {
  const controller = createPrequelCompassIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

import { createPrequelCompassIcon } from "./prequel-compass.js";

export function createPrequelCompassSolidIcon(root, options = {}) {
  const controller = createPrequelCompassIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

import { createPrequelWindIcon } from "./prequel-wind.js";

export function createPrequelWindSolidIcon(root, options = {}) {
  const controller = createPrequelWindIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

import { createPrequelLungsIcon } from "./prequel-lungs.js";

export function createPrequelLungsSolidIcon(root, options = {}) {
  const controller = createPrequelLungsIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

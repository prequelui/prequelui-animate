import { createPrequelLungsIcon } from "./prequel-lungs.js";

export function createPrequelLungsColorIcon(root, options = {}) {
  const controller = createPrequelLungsIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

import { createPrequelCarIcon } from "./prequel-car.js";

export function createPrequelCarColorIcon(root, options = {}) {
  const controller = createPrequelCarIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

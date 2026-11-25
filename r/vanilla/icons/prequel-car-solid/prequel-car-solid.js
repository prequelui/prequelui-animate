import { createPrequelCarIcon } from "./prequel-car.js";

export function createPrequelCarSolidIcon(root, options = {}) {
  const controller = createPrequelCarIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

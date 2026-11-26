import { createPrequelCarIcon } from "./prequel-car.js";

export function createPrequelCarDuotoneIcon(root, options = {}) {
  const controller = createPrequelCarIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

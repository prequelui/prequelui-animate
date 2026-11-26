import { createPrequelLaptopIcon } from "./prequel-laptop.js";

export function createPrequelLaptopDuotoneIcon(root, options = {}) {
  const controller = createPrequelLaptopIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

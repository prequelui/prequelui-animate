import { createPrequelLaptopIcon } from "./prequel-laptop.js";

export function createPrequelLaptopSolidIcon(root, options = {}) {
  const controller = createPrequelLaptopIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

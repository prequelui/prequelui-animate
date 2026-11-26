import { createPrequelLaptopIcon } from "./prequel-laptop.js";

export function createPrequelLaptopColorIcon(root, options = {}) {
  const controller = createPrequelLaptopIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

import { createPrequelHourglassIcon } from "./prequel-hourglass.js";

export function createPrequelHourglassColorIcon(root, options = {}) {
  const controller = createPrequelHourglassIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

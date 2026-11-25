import { createPrequelHourglassIcon } from "./prequel-hourglass.js";

export function createPrequelHourglassSolidIcon(root, options = {}) {
  const controller = createPrequelHourglassIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

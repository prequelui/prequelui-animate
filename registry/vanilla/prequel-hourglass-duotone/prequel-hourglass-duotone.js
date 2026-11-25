import { createPrequelHourglassIcon } from "./prequel-hourglass.js";

export function createPrequelHourglassDuotoneIcon(root, options = {}) {
  const controller = createPrequelHourglassIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

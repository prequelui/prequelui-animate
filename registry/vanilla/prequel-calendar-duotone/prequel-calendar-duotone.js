import { createPrequelCalendarIcon } from "./prequel-calendar.js";

export function createPrequelCalendarDuotoneIcon(root, options = {}) {
  const controller = createPrequelCalendarIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

import { createPrequelCalendarIcon } from "./prequel-calendar.js";

export function createPrequelCalendarSolidIcon(root, options = {}) {
  const controller = createPrequelCalendarIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

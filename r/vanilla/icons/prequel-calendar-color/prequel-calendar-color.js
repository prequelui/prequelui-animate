import { createPrequelCalendarIcon } from "./prequel-calendar.js";

export function createPrequelCalendarColorIcon(root, options = {}) {
  const controller = createPrequelCalendarIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

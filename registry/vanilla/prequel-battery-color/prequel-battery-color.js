import { createPrequelBatteryIcon } from "./prequel-battery.js";

export function createPrequelBatteryColorIcon(root, options = {}) {
  const controller = createPrequelBatteryIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

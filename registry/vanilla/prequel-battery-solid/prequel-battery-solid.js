import { createPrequelBatteryIcon } from "./prequel-battery.js";

export function createPrequelBatterySolidIcon(root, options = {}) {
  const controller = createPrequelBatteryIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

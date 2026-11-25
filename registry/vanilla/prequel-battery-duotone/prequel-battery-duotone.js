import { createPrequelBatteryIcon } from "./prequel-battery.js";

export function createPrequelBatteryDuotoneIcon(root, options = {}) {
  const controller = createPrequelBatteryIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

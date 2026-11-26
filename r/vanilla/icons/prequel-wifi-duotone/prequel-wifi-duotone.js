import { createPrequelWifiIcon } from "./prequel-wifi.js";

export function createPrequelWifiDuotoneIcon(root, options = {}) {
  const controller = createPrequelWifiIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

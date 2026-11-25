import { createPrequelWifiIcon } from "./prequel-wifi.js";

export function createPrequelWifiSolidIcon(root, options = {}) {
  const controller = createPrequelWifiIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

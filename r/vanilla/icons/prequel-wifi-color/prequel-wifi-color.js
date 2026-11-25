import { createPrequelWifiIcon } from "./prequel-wifi.js";

export function createPrequelWifiColorIcon(root, options = {}) {
  const controller = createPrequelWifiIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

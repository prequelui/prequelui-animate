import { createPrequelBluetoothIcon } from "./prequel-bluetooth.js";

export function createPrequelBluetoothColorIcon(root, options = {}) {
  const controller = createPrequelBluetoothIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

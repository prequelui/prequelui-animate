import { createPrequelBluetoothIcon } from "./prequel-bluetooth.js";

export function createPrequelBluetoothSolidIcon(root, options = {}) {
  const controller = createPrequelBluetoothIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

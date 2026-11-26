import { createPrequelBluetoothIcon } from "./prequel-bluetooth.js";

export function createPrequelBluetoothDuotoneIcon(root, options = {}) {
  const controller = createPrequelBluetoothIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

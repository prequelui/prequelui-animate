import { createPrequelBluetoothIcon } from "./prequel-bluetooth.js";

export function createPrequelBluetoothEmojiIcon(root, options = {}) {
  const controller = createPrequelBluetoothIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

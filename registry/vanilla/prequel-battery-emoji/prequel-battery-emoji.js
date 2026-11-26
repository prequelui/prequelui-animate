import { createPrequelBatteryIcon } from "./prequel-battery.js";

export function createPrequelBatteryEmojiIcon(root, options = {}) {
  const controller = createPrequelBatteryIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

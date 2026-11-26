import { createPrequelWifiIcon } from "./prequel-wifi.js";

export function createPrequelWifiEmojiIcon(root, options = {}) {
  const controller = createPrequelWifiIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

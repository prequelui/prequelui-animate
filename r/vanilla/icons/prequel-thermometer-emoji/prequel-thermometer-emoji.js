import { createPrequelThermometerIcon } from "./prequel-thermometer.js";

export function createPrequelThermometerEmojiIcon(root, options = {}) {
  const controller = createPrequelThermometerIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

import { createPrequelMapPinIcon } from "./prequel-map-pin.js";

export function createPrequelMapPinEmojiIcon(root, options = {}) {
  const controller = createPrequelMapPinIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

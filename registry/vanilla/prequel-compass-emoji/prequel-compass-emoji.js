import { createPrequelCompassIcon } from "./prequel-compass.js";

export function createPrequelCompassEmojiIcon(root, options = {}) {
  const controller = createPrequelCompassIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

import { createPrequelImageIcon } from "./prequel-image.js";

export function createPrequelImageEmojiIcon(root, options = {}) {
  const controller = createPrequelImageIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

import { createPrequelLungsIcon } from "./prequel-lungs.js";

export function createPrequelLungsEmojiIcon(root, options = {}) {
  const controller = createPrequelLungsIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

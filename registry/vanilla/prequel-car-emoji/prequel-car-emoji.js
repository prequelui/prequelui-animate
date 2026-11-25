import { createPrequelCarIcon } from "./prequel-car.js";

export function createPrequelCarEmojiIcon(root, options = {}) {
  const controller = createPrequelCarIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

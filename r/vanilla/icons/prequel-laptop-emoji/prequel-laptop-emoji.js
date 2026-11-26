import { createPrequelLaptopIcon } from "./prequel-laptop.js";

export function createPrequelLaptopEmojiIcon(root, options = {}) {
  const controller = createPrequelLaptopIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

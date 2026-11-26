import { createPrequelHourglassIcon } from "./prequel-hourglass.js";

export function createPrequelHourglassEmojiIcon(root, options = {}) {
  const controller = createPrequelHourglassIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

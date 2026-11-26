import { createPrequelRepeatIcon } from "./prequel-repeat.js";

export function createPrequelRepeatEmojiIcon(root, options = {}) {
  const controller = createPrequelRepeatIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

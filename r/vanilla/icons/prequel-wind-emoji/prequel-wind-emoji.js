import { createPrequelWindIcon } from "./prequel-wind.js";

export function createPrequelWindEmojiIcon(root, options = {}) {
  const controller = createPrequelWindIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

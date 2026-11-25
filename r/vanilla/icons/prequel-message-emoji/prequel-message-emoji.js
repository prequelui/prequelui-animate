import { createPrequelMessageIcon } from "./prequel-message.js";

export function createPrequelMessageEmojiIcon(root, options = {}) {
  const controller = createPrequelMessageIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

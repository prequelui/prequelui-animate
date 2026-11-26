import { createPrequelCodeIcon } from "./prequel-code.js";

export function createPrequelCodeEmojiIcon(root, options = {}) {
  const controller = createPrequelCodeIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

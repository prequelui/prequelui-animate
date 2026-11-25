import { createPrequelSendIcon } from "./prequel-send.js";

export function createPrequelSendEmojiIcon(root, options = {}) {
  const controller = createPrequelSendIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

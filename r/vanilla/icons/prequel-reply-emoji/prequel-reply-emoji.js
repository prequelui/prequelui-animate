import { createPrequelReplyIcon } from "./prequel-reply.js";

export function createPrequelReplyEmojiIcon(root, options = {}) {
  const controller = createPrequelReplyIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

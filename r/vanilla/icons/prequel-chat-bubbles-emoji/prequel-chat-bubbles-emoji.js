import { createPrequelChatBubblesIcon } from "./prequel-chat-bubbles.js";

export function createPrequelChatBubblesEmojiIcon(root, options = {}) {
  const controller = createPrequelChatBubblesIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

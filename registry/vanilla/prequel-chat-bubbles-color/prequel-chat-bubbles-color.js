import { createPrequelChatBubblesIcon } from "./prequel-chat-bubbles.js";

export function createPrequelChatBubblesColorIcon(root, options = {}) {
  const controller = createPrequelChatBubblesIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

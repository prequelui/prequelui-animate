import { createPrequelChatBubblesIcon } from "./prequel-chat-bubbles.js";

export function createPrequelChatBubblesSolidIcon(root, options = {}) {
  const controller = createPrequelChatBubblesIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

import { createPrequelChatBubblesIcon } from "./prequel-chat-bubbles.js";

export function createPrequelChatBubblesDuotoneIcon(root, options = {}) {
  const controller = createPrequelChatBubblesIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

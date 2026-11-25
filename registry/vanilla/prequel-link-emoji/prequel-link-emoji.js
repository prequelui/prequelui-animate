import { createPrequelLinkIcon } from "./prequel-link.js";

export function createPrequelLinkEmojiIcon(root, options = {}) {
  const controller = createPrequelLinkIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

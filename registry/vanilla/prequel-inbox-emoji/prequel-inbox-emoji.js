import { createPrequelInboxIcon } from "./prequel-inbox.js";

export function createPrequelInboxEmojiIcon(root, options = {}) {
  const controller = createPrequelInboxIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

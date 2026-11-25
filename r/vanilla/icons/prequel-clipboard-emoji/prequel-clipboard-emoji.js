import { createPrequelClipboardIcon } from "./prequel-clipboard.js";

export function createPrequelClipboardEmojiIcon(root, options = {}) {
  const controller = createPrequelClipboardIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

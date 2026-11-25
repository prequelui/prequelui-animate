import { createPrequelAtSignIcon } from "./prequel-at-sign.js";

export function createPrequelAtSignEmojiIcon(root, options = {}) {
  const controller = createPrequelAtSignIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

import { createPrequelMegaphoneIcon } from "./prequel-megaphone.js";

export function createPrequelMegaphoneEmojiIcon(root, options = {}) {
  const controller = createPrequelMegaphoneIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

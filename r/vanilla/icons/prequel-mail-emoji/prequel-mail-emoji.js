import { createPrequelMailIcon } from "./prequel-mail.js";

export function createPrequelMailEmojiIcon(root, options = {}) {
  const controller = createPrequelMailIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

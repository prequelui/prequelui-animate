import { createPrequelPassportIcon } from "./prequel-passport.js";

export function createPrequelPassportEmojiIcon(root, options = {}) {
  const controller = createPrequelPassportIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

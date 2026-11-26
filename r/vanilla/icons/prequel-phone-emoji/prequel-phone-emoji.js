import { createPrequelPhoneIcon } from "./prequel-phone.js";

export function createPrequelPhoneEmojiIcon(root, options = {}) {
  const controller = createPrequelPhoneIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

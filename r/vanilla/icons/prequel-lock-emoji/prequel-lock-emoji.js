import { createPrequelLockIcon } from "./prequel-lock.js";

export function createPrequelLockEmojiIcon(root, options = {}) {
  const controller = createPrequelLockIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

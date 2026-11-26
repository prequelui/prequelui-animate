import { createPrequelBellIcon } from "./prequel-bell.js";

export function createPrequelBellEmojiIcon(root, options = {}) {
  const controller = createPrequelBellIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

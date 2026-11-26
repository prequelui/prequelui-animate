import { createPrequelUserIcon } from "./prequel-user.js";

export function createPrequelUserEmojiIcon(root, options = {}) {
  const controller = createPrequelUserIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

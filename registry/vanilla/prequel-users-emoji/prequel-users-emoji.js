import { createPrequelUsersIcon } from "./prequel-users.js";

export function createPrequelUsersEmojiIcon(root, options = {}) {
  const controller = createPrequelUsersIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

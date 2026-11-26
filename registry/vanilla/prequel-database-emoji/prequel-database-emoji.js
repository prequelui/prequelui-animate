import { createPrequelDatabaseIcon } from "./prequel-database.js";

export function createPrequelDatabaseEmojiIcon(root, options = {}) {
  const controller = createPrequelDatabaseIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

import { createPrequelServerIcon } from "./prequel-server.js";

export function createPrequelServerEmojiIcon(root, options = {}) {
  const controller = createPrequelServerIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

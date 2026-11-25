import { createPrequelPlaneIcon } from "./prequel-plane.js";

export function createPrequelPlaneEmojiIcon(root, options = {}) {
  const controller = createPrequelPlaneIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

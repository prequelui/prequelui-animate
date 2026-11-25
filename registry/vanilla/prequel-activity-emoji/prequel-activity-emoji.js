import { createPrequelActivityIcon } from "./prequel-activity.js";

export function createPrequelActivityEmojiIcon(root, options = {}) {
  const controller = createPrequelActivityIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

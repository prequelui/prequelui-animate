import { createPrequelFirstAidIcon } from "./prequel-first-aid.js";

export function createPrequelFirstAidEmojiIcon(root, options = {}) {
  const controller = createPrequelFirstAidIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

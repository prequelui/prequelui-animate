import { createPrequelPillIcon } from "./prequel-pill.js";

export function createPrequelPillEmojiIcon(root, options = {}) {
  const controller = createPrequelPillIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

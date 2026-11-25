import { createPrequelPauseIcon } from "./prequel-pause.js";

export function createPrequelPauseEmojiIcon(root, options = {}) {
  const controller = createPrequelPauseIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

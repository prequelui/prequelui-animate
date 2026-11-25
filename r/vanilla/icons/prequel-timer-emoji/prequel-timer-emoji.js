import { createPrequelTimerIcon } from "./prequel-timer.js";

export function createPrequelTimerEmojiIcon(root, options = {}) {
  const controller = createPrequelTimerIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

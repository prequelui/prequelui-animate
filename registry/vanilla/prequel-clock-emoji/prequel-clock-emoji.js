import { createPrequelClockIcon } from "./prequel-clock.js";

export function createPrequelClockEmojiIcon(root, options = {}) {
  const controller = createPrequelClockIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

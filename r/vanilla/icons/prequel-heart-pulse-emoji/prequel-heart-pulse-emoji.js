import { createPrequelHeartPulseIcon } from "./prequel-heart-pulse.js";

export function createPrequelHeartPulseEmojiIcon(root, options = {}) {
  const controller = createPrequelHeartPulseIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

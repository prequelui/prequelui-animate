import { createPrequelPlayIcon } from "./prequel-play.js";

export function createPrequelPlayEmojiIcon(root, options = {}) {
  const controller = createPrequelPlayIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

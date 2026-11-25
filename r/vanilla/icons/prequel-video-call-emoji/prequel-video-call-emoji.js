import { createPrequelVideoCallIcon } from "./prequel-video-call.js";

export function createPrequelVideoCallEmojiIcon(root, options = {}) {
  const controller = createPrequelVideoCallIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

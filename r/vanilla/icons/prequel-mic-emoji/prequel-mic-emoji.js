import { createPrequelMicrophoneIcon } from "./prequel-mic.js";

export function createPrequelMicrophoneEmojiIcon(root, options = {}) {
  const controller = createPrequelMicrophoneIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

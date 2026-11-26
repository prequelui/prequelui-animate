import { createPrequelSubtitlesIcon } from "./prequel-subtitles.js";

export function createPrequelSubtitlesEmojiIcon(root, options = {}) {
  const controller = createPrequelSubtitlesIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

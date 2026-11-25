import { createPrequelMusicIcon } from "./prequel-music.js";

export function createPrequelMusicEmojiIcon(root, options = {}) {
  const controller = createPrequelMusicIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

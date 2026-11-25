import { createPrequelPodcastIcon } from "./prequel-podcast.js";

export function createPrequelPodcastEmojiIcon(root, options = {}) {
  const controller = createPrequelPodcastIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

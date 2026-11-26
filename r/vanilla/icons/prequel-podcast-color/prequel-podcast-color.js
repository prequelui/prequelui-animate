import { createPrequelPodcastIcon } from "./prequel-podcast.js";

export function createPrequelPodcastColorIcon(root, options = {}) {
  const controller = createPrequelPodcastIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}

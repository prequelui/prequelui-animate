import { createPrequelPodcastIcon } from "./prequel-podcast.js";

export function createPrequelPodcastSolidIcon(root, options = {}) {
  const controller = createPrequelPodcastIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}

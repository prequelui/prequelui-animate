import { createPrequelPodcastIcon } from "./prequel-podcast.js";

export function createPrequelPodcastDuotoneIcon(root, options = {}) {
  const controller = createPrequelPodcastIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}

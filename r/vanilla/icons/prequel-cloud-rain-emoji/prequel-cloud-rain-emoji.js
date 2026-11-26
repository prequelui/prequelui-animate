import { createPrequelCloudRainIcon } from "./prequel-cloud-rain.js";

export function createPrequelCloudRainEmojiIcon(root, options = {}) {
  const controller = createPrequelCloudRainIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

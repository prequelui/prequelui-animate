import { createPrequelDropletIcon } from "./prequel-droplet.js";

export function createPrequelDropletEmojiIcon(root, options = {}) {
  const controller = createPrequelDropletIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

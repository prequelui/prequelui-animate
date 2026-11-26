import { createPrequelCloudIcon } from "./prequel-cloud.js";

export function createPrequelCloudEmojiIcon(root, options = {}) {
  const controller = createPrequelCloudIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

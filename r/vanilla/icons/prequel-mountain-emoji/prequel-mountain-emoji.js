import { createPrequelMountainIcon } from "./prequel-mountain.js";

export function createPrequelMountainEmojiIcon(root, options = {}) {
  const controller = createPrequelMountainIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

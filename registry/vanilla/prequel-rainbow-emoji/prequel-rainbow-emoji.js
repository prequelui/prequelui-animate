import { createPrequelRainbowIcon } from "./prequel-rainbow.js";

export function createPrequelRainbowEmojiIcon(root, options = {}) {
  const controller = createPrequelRainbowIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

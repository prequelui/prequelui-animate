import { createPrequelWandIcon } from "./prequel-wand.js";

export function createPrequelWandEmojiIcon(root, options = {}) {
  const controller = createPrequelWandIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

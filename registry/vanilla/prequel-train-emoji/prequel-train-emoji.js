import { createPrequelTrainIcon } from "./prequel-train.js";

export function createPrequelTrainEmojiIcon(root, options = {}) {
  const controller = createPrequelTrainIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

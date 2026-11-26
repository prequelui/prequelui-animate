import { createPrequelNeuralIcon } from "./prequel-neural.js";

export function createPrequelNeuralEmojiIcon(root, options = {}) {
  const controller = createPrequelNeuralIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

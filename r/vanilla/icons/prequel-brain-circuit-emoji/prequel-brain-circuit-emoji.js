import { createPrequelBrainCircuitIcon } from "./prequel-brain-circuit.js";

export function createPrequelBrainCircuitEmojiIcon(root, options = {}) {
  const controller = createPrequelBrainCircuitIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

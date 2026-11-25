import { createPrequelDnaIcon } from "./prequel-dna.js";

export function createPrequelDnaEmojiIcon(root, options = {}) {
  const controller = createPrequelDnaIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

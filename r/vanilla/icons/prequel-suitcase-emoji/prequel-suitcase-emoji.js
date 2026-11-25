import { createPrequelSuitcaseIcon } from "./prequel-suitcase.js";

export function createPrequelSuitcaseEmojiIcon(root, options = {}) {
  const controller = createPrequelSuitcaseIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

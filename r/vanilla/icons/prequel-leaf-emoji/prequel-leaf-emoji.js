import { createPrequelLeafIcon } from "./prequel-leaf.js";

export function createPrequelLeafEmojiIcon(root, options = {}) {
  const controller = createPrequelLeafIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

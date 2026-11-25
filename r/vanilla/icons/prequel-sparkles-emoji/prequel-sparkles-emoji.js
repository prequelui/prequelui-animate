import { createPrequelSparklesIcon } from "./prequel-sparkles.js";

export function createPrequelSparklesEmojiIcon(root, options = {}) {
  const controller = createPrequelSparklesIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

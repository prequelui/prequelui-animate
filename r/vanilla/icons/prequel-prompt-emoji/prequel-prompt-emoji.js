import { createPrequelPromptIcon } from "./prequel-prompt.js";

export function createPrequelPromptEmojiIcon(root, options = {}) {
  const controller = createPrequelPromptIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

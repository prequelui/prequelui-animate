import { createPrequelBracesIcon } from "./prequel-braces.js";

export function createPrequelBracesEmojiIcon(root, options = {}) {
  const controller = createPrequelBracesIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

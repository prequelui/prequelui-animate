import { createPrequelPercentIcon } from "./prequel-percent.js";

export function createPrequelPercentEmojiIcon(root, options = {}) {
  const controller = createPrequelPercentIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

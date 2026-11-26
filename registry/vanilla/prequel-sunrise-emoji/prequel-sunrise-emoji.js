import { createPrequelSunriseIcon } from "./prequel-sunrise.js";

export function createPrequelSunriseEmojiIcon(root, options = {}) {
  const controller = createPrequelSunriseIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

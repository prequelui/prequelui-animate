import { createPrequelRefreshIcon } from "./prequel-refresh.js";

export function createPrequelRefreshEmojiIcon(root, options = {}) {
  const controller = createPrequelRefreshIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

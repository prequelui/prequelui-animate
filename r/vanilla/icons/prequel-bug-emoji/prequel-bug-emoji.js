import { createPrequelBugIcon } from "./prequel-bug.js";

export function createPrequelBugEmojiIcon(root, options = {}) {
  const controller = createPrequelBugIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

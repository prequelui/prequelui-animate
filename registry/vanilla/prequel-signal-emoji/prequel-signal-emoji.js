import { createPrequelSignalIcon } from "./prequel-signal.js";

export function createPrequelSignalEmojiIcon(root, options = {}) {
  const controller = createPrequelSignalIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

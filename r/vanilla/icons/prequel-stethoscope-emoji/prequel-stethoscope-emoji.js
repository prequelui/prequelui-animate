import { createPrequelStethoscopeIcon } from "./prequel-stethoscope.js";

export function createPrequelStethoscopeEmojiIcon(root, options = {}) {
  const controller = createPrequelStethoscopeIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

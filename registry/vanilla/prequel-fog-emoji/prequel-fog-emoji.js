import { createPrequelFogIcon } from "./prequel-fog.js";

export function createPrequelFogEmojiIcon(root, options = {}) {
  const controller = createPrequelFogIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

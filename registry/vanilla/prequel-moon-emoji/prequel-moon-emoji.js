import { createPrequelMoonIcon } from "./prequel-moon.js";

export function createPrequelMoonEmojiIcon(root, options = {}) {
  const controller = createPrequelMoonIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}

import { createPrequelGlobeIcon } from "./prequel-globe.js";

export function createPrequelGlobeEmojiIcon(root, options = {}) {
  const controller = createPrequelGlobeIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
